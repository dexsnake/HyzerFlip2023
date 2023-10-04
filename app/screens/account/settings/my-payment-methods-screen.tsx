import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext, useEffect, useRef } from 'react'
import { Pressable, TextStyle, View, ViewStyle, Text, ActivityIndicator, Alert, Animated } from 'react-native'
import { Header, Screen } from '../../../components'
import { ProfileContext } from '../../../context/Profile'
import { useApplePay, useStripe } from '@stripe/stripe-react-native'
import { checkoutStore } from '../../../state/checkout-state'
import { useHookstate } from '@hookstate/core'
import CreditCardDisplay from '../../../components/account/settings/credit-card-display'
import { Swipeable, RectButton } from 'react-native-gesture-handler'
import LoadingOverlay from '../../../components/modals/loading-overlay'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import Stripe from 'stripe'
import { PaymentMethodAPI } from '../../../services/api/payment-method-api'
import { CustomerAPI } from '../../../services/api/customer-api'
import { api } from '../../../services/api'
import { PlusCircleIcon } from 'react-native-heroicons/outline'

export const MyPaymentMethodsScreen: FC<StackScreenProps<SettingsStackParamsList, 'payment-methods-screen'>> = ({ navigation }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const { payment, applePay } = useHookstate(checkoutStore)

	const { profile } = useContext(ProfileContext)

	const { initPaymentSheet, presentPaymentSheet } = useStripe()
	const { isApplePaySupported } = useApplePay()

	const [paymentMethods, setPaymentMethods] = React.useState<Stripe.PaymentMethod[] | null>(null)
	const [deleting, setDeleting] = React.useState(false)

	const NEW_CARD_CONTAINER: ViewStyle = { backgroundColor: '#fff', padding: 16, marginBottom: 8 }
	const CARD_CONTAINER: ViewStyle = { backgroundColor: '#fff', padding: 16 }
	const CARD_WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' }
	const BUTTON: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' }
	const BUTTON_TEXT: TextStyle = { color: '#2563EB', marginLeft: 10, fontWeight: '500' }
	const RADIO_CONTAINER: ViewStyle = { marginRight: 10 }
	const RADIO_OUTER: ViewStyle = {
		borderWidth: 1,
		height: 20,
		width: 20,
		borderRadius: 50,
		borderColor: '#d1d5db'
	}
	const RADIO_OUTER_CHECKED: ViewStyle = {
		borderWidth: 2,
		height: 20,
		width: 20,
		borderRadius: 50,
		borderColor: '#2563EB',
		alignItems: 'center',
		justifyContent: 'center'
	}
	const RADIO_INNER: ViewStyle = {
		height: 10,
		width: 10,
		borderRadius: 50,
		backgroundColor: '#2563EB'
	}

	const fetchPaymentSheetParams = async () => {
		const { data } = await api.apisauce.post<{ setupIntent: string; ephemeralKey: string }>('/stripe/payment-sheet', {
			customer_id: profile.customer_id
		})
		const { setupIntent, ephemeralKey } = data

		return {
			setupIntent,
			ephemeralKey
		}
	}

	const initializePaymentSheet = async () => {
		const { setupIntent, ephemeralKey } = await fetchPaymentSheetParams()

		await initPaymentSheet({
			customerId: profile.customer_id,
			customerEphemeralKeySecret: ephemeralKey,
			setupIntentClientSecret: setupIntent,
			merchantDisplayName: 'Hyzer Flip'
		})
	}

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet()

		if (error) {
			if (error.code !== 'Canceled') {
				Alert.alert(`Error code: ${error.code}`, error.message)
			} else getCards(profile.customer_id)
		} else {
			Alert.alert('Success', 'Your payment method is successfully set up for future payments!')
			getCards(profile.customer_id, true)
		}
	}

	async function getCards(customer_id: string, setNew?: boolean) {
		try {
			const response = await PaymentMethodAPI.getPaymentMethods(customer_id)
			if (response.kind !== 'ok') throw new Error('Could not get payment methods')
			if (response.kind === 'ok') {
				setPaymentMethods(response.paymentMethods)

				// If setNew is set to true, find the newest payment method returned from the api call and set it as the active payment method
				if (setNew) {
					const newest = response.paymentMethods.reduce((prev, current) => (prev.created > current.created ? prev : current))
					setDefaultCard(customer_id, newest.id)
					payment.set(newest)
					applePay.set(false)
					goBack()
				}
			}
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	async function setDefaultCard(customer_id: string, paymentId: string) {
		try {
			const response = await CustomerAPI.updateCustomer(customer_id, { invoice_settings: { default_payment_method: paymentId } })
			if (response.kind !== 'ok') throw new Error('Could not update customer')
		} catch (error: any) {
			Alert.alert(error.message)
		}
	}

	function handleSetPayment(card: Stripe.PaymentMethod) {
		payment.set(card)
		applePay.set(false)
		setDefaultCard(profile.customer_id, card.id)
		goBack()
	}

	function handleSelectApplePay() {
		applePay.set(true)
		payment.set(null)
		goBack()
	}

	useEffect(() => {
		initializePaymentSheet()
	}, [])

	useEffect(() => {
		if (profile) getCards(profile.customer_id)
	}, [])

	const rightAction: ViewStyle = {
		flex: 1,
		backgroundColor: 'red',
		justifyContent: 'flex-end',
		alignItems: 'center',
		flexDirection: 'row',
		maxWidth: 100
	}

	const actionIcon = {
		width: 30,
		marginHorizontal: 30
	}

	const swipeableRef = useRef(null)

	const closeSwipeable = () => {
		swipeableRef.current.close()
	}

	const handleDelete = async (paymentMethodId: string) => {
		try {
			setDeleting(true)
			await PaymentMethodAPI.deletePaymentMethod(paymentMethodId)
			if (paymentMethodId === payment.value.id) payment.set(null)
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setDeleting(false)
		}
	}

	const triggerDelete = (paymentMethodId: string) => {
		closeSwipeable()
		Alert.alert('Delete payment', 'Are you sure you want to delete this payment?', [
			{ text: 'Yes', onPress: () => handleDelete(paymentMethodId).then(() => getCards(profile.customer_id)) },
			{ text: 'No' }
		])
	}

	const renderRightActions = (dragX: Animated.AnimatedInterpolation, paymentMethodId: string) => {
		const opacity = dragX.interpolate({
			inputRange: [-80, 0],
			outputRange: [1, 0],
			extrapolate: 'clamp'
		})

		return (
			<RectButton onPress={() => triggerDelete(paymentMethodId)}>
				<Animated.View style={[rightAction, { opacity }]}>{/* <AnimatedIcon size={30} color="#fff" style={actionIcon} /> */}</Animated.View>
			</RectButton>
		)
	}

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="My payment methods" leftIcon="back" onLeftPress={goBack} />
				<View className="mt-3 border-b-gray-300 pb-3 border-b-line">
					{paymentMethods &&
						paymentMethods.length > 0 &&
						paymentMethods.map((card) => {
							return (
								<Swipeable
									ref={swipeableRef}
									friction={1}
									overshootRight={false}
									renderRightActions={(progress, dragX) => renderRightActions(dragX, card.id)}
									key={card.id}
								>
									<Pressable onPress={() => handleSetPayment(card)} style={CARD_CONTAINER}>
										<View style={CARD_WRAPPER}>
											<View style={RADIO_CONTAINER}>
												<View style={card.id === payment.value?.id ? RADIO_OUTER_CHECKED : RADIO_OUTER}>
													<View style={card.id === payment.value?.id ? RADIO_INNER : {}}></View>
												</View>
											</View>
											<CreditCardDisplay card={card} />
										</View>
									</Pressable>
								</Swipeable>
							)
						})}
					{!paymentMethods && <ActivityIndicator />}
				</View>
				<View style={NEW_CARD_CONTAINER}>
					<Pressable onPress={openPaymentSheet} style={BUTTON}>
						<PlusCircleIcon size={30} color="#2563EB" />
						<Text style={BUTTON_TEXT}>Add new card</Text>
					</Pressable>
				</View>
				<View className="mt-6">
					<View className="px-4">
						<Text className="font-semibold text-xl text-gray-700">Or pay with</Text>
					</View>
					{isApplePaySupported && (
						<Pressable onPress={handleSelectApplePay} style={CARD_CONTAINER}>
							<View style={CARD_WRAPPER}>
								<View style={RADIO_CONTAINER}>
									<View style={applePay.value ? RADIO_OUTER_CHECKED : RADIO_OUTER}>
										<View style={applePay.value ? RADIO_INNER : {}}></View>
									</View>
								</View>
								<CreditCardDisplay applePay />
							</View>
						</Pressable>
					)}
				</View>
				<LoadingOverlay show={deleting} />
			</Screen>
		</View>
	)
}
