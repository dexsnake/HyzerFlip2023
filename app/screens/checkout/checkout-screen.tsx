import { useHookstate } from '@hookstate/core'
import { StackScreenProps } from '@react-navigation/stack'
import { ApiResponse } from 'apisauce'
import React, { FC, useContext } from 'react'
import { ActivityIndicator, TextStyle, View, ViewStyle, Text, Alert } from 'react-native'
import { Button, Header, Screen } from '../../components'
import Billing from '../../components/checkout/billing'
import Delivery from '../../components/checkout/delivery'
import ItemOverview from '../../components/checkout/item-overview'
import { ProfileContext } from '../../context/Profile'
import { CheckoutStackParamsList } from '../../navigators/stacks/Checkout'
import { api } from '../../services/api'
import { checkoutStore, clearCheckoutStore } from '../../state/checkout-state'
import { supabase } from '../../clients/supabase'
import { colors, spacing } from '../../theme'
import { createSale } from '../../utils/supabase/createSale'
import { isListingAvailable } from '../../utils/supabase/isListingAvailable'
import { updateListing } from '../../utils/supabase/updateListing'
import formatPrice from '../../utils/formatPrice'
import { screenWidth } from '../../utils/screen-dimensions'
import { ApplePayButton, useApplePay, PaymentMethod } from '@stripe/stripe-react-native'
import Stripe from 'stripe'
import useCustomer from '../../hooks/useCustomer'
import { useIsFocused } from '@react-navigation/native'
import validateCheckout from '../../utils/checkout/validate'
import LoadingOverlay from '../../components/modals/loading-overlay'

export const CheckoutScreen: FC<StackScreenProps<CheckoutStackParamsList, 'checkout-screen'>> = ({ navigation }) => {
	const isFocused = useIsFocused()

	// Store
	const { listing, payment, applePay } = useHookstate(checkoutStore)

	// Context
	const { profile } = useContext(ProfileContext)

	// Local State
	const [loading, setLoading] = React.useState(false)

	// Hooks
	const { customer } = useCustomer(profile?.customer_id, isFocused)
	const { isApplePaySupported, presentApplePay, confirmApplePayPayment } = useApplePay()

	const goBack = () => {
		navigation.goBack()
		clearCheckoutStore()
	}

	const HEADER: TextStyle = {
		paddingTop: 28,
		paddingBottom: 16,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		borderBottomColor: '#d1d5db',
		borderBottomWidth: 0.75
	}
	const HEADER_TITLE: TextStyle = {
		color: '#1f2937',
		fontWeight: '500',
		textAlign: 'center',
		letterSpacing: 1.2
	}
	const BUTTON_CONTAINER: ViewStyle = {
		paddingHorizontal: 16,
		paddingVertical: 24,
		flex: 1,
		justifyContent: 'flex-end'
	}
	const BUTTON_TEXT: TextStyle = { color: '#fff', fontSize: 15, fontWeight: '500' }

	async function handleCheckout(type: 'card' | 'applePay', errorTest?: boolean) {
		let paymentIntentId: string
		let saleId: number
		const listingId = listing.value.id
		let notificationId: string
		try {
			// Validate the customers address and payment
			const errors = validateCheckout(customer?.shipping?.address, payment.value, applePay.value)
			if (errors) setLoading(false)
			else {
				if (type === 'card') setLoading(true)

				// Check to see if the listing is still marked as active before continuing
				const available = await isListingAvailable(listing.value.id)
				if (!available) {
					navigation.goBack()
					throw new Error('This listing is no longer available for purchase')
				}

				// Get the merchant_id from the seller
				const { data, error } = await supabase.from('profiles').select('merchant_id').eq('id', listing.value.user_id).single()
				if (error) throw new Error(error.message)

				let applePayPaymentMethod: PaymentMethod.Result

				// If applePay is payment, show the applePay sheet and set the payment
				if (type === 'applePay') {
					const { error, paymentMethod } = await presentApplePay({
						cartItems: [
							{ label: 'Subtotal', amount: listing.price.value.toFixed(2), paymentType: 'Immediate' },
							{ label: 'Shipping', amount: listing.shipping_cost.value.toFixed(2), paymentType: 'Immediate' },
							{ label: 'Coupon', amount: '0.00', paymentType: 'Immediate' },
							{ label: 'Hyzer Flip', amount: (listing.price.value + listing.shipping_cost.value).toFixed(2), paymentType: 'Immediate' }
						],
						country: 'US',
						currency: 'USD',
						requiredShippingAddressFields: ['name', 'postalAddress']
					})
					if (error) throw new Error(error.message)
					if (paymentMethod) applePayPaymentMethod = paymentMethod
				}

				// Hit the payment-intent api endpoint - it returns the payment intent object
				const paymentIntent: ApiResponse<Stripe.PaymentIntent> = await api.apisauce.post('/stripe/payment-intents/create', {
					listingId: listing.value.id,
					customer_id: profile.customer_id,
					merchantId: data.merchant_id
				})
				if (!paymentIntent.ok) throw new Error(paymentIntent.originalError.response.data)
				paymentIntentId = paymentIntent.data.id

				// Create a sale document in the Sales collection
				const sale = await createSale(
					profile.id,
					listing.value.user_id,
					listing.value.id,
					paymentIntent.data.id,
					listing.value.price,
					listing.value.shipping_cost,
					profile.customer_id,
					data.merchant_id,
					customer.shipping
				)
				saleId = sale.id
				// update the listing and mark it as sold
				await updateListing(listing.value.id, { status: 'sold', sold_at: new Date().toISOString() })
				if (errorTest) throw new Error('Test error')

				if (type === 'applePay') {
					const { error } = await confirmApplePayPayment(paymentIntent.data.client_secret)
					setLoading(true)
					if (error) throw new Error(error.message)
				} else {
					const confirmPaymentIntent: ApiResponse<Stripe.PaymentIntent> = await api.apisauce.post('/stripe/payment-intents/confirm', {
						id: paymentIntent.data.id,
						paymentMethod: applePayPaymentMethod ? applePayPaymentMethod.id : payment.value.id
					})
					if (!confirmPaymentIntent.ok) throw new Error(confirmPaymentIntent.originalError.response.data)
				}

				const { data: notification } = await api.apisauce.post<{ id: string }>('/notifications/item-sold', {
					listingId: listing.value.id
				})
				notificationId = notification.id
				navigation.navigate('confirmation')
			}
		} catch (error) {
			cleanUp(saleId, paymentIntentId, listingId, notificationId)
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	async function cleanUp(saleId: number, paymentIntentId: string, listingId: string, notificationId: string) {
		if (paymentIntentId) api.apisauce.post('/stripe/payment-intents/cancel', { id: paymentIntentId })
		updateListing(listingId, { status: 'active', sold_at: null })
		if (saleId) await supabase.from('sales').delete().eq('id', saleId)
		if (notificationId) await api.apisauce.post<{ id: string }>('/notifications/cancel', { id: notificationId })
	}

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="Checkout" leftIcon="bell" onLeftPress={goBack} style={HEADER} titleStyle={HEADER_TITLE} />
				{listing.value && <ItemOverview />}
				<Delivery customer={customer} navigation={navigation} />
				<Billing navigation={navigation} />
				{listing.value && (
					<View style={{ backgroundColor: '#fff', paddingVertical: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
						<View style={{ marginLeft: screenWidth / 4 }}>
							<Text style={{ marginBottom: 8, color: 'gray' }}>Subtotal</Text>
							<Text style={{ marginBottom: 8, color: 'gray' }}>Shipping</Text>
							<Text style={{ fontWeight: '500', color: '#374151' }}>You pay</Text>
						</View>
						<View style={{ marginRight: screenWidth / 6 }}>
							<Text style={{ marginBottom: 8, textAlign: 'right', color: '#374151' }}>{formatPrice(listing.value.price)}</Text>
							<Text style={{ marginBottom: 8, textAlign: 'right', color: '#374151' }}>{formatPrice(listing.value.shipping_cost)}</Text>
							<Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'right', color: '#374151' }}>
								{formatPrice(listing.value.price + listing.value.shipping_cost)}
							</Text>
						</View>
					</View>
				)}

				<View style={BUTTON_CONTAINER}>
					{isApplePaySupported && applePay.value && (
						<ApplePayButton
							onPress={() => handleCheckout('applePay')}
							type="buy"
							buttonStyle="black"
							borderRadius={4}
							style={{
								width: '100%',
								height: 50
							}}
						/>
					)}
					{!applePay.value && (
						<Button onPress={() => handleCheckout('card')}>
							<Text style={BUTTON_TEXT}>Checkout</Text>
						</Button>
					)}
				</View>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
}
