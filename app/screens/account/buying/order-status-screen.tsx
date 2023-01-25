import { useIsFocused } from '@react-navigation/native'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { addDays, format } from 'date-fns'
import React, { FC, useContext, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { Sale } from '../../../../types'
import { Button, Header, Screen } from '../../../components'
import Address from '../../../components/address'
import SellerSection from '../../../components/listing/SellerSection'
import PurchaseCard from '../../../components/purchase-card'
import { ProfileContext } from '../../../context/Profile'
import useCustomer from '../../../hooks/useCustomer'
import useProfile from '../../../hooks/useProfile'
import usePurchase, { SaleWithListing } from '../../../hooks/usePurchase'
import { AccountStackParamsList } from '../../../navigators/stacks/Account'
import formatPrice from '../../../utils/formatPrice'
import { getTracking } from 'ts-tracking-number'
import { openBrowserAsync } from 'expo-web-browser'
import { PLATFORM_FEE_RATE, PROCESSING_FEE_FIXED, PROCESSING_FEE_RATE } from '../../../constants/Fees'
import { calculateEarn } from '../../../utils/calculateEarn'
import { calculatePlatformFee } from '../../../utils/calculatePlatformFee'
import { calculateProcessingFee } from '../../../utils/calculateProcessingFee'
import { api } from '../../../services/api'
import { supabase } from '../../../clients/supabase'
import LoadingOverlay from '../../../components/modals/loading-overlay'

export const OrderStatusScreen: FC<StackScreenProps<AccountStackParamsList, 'order-status'>> = ({ navigation, route }) => {
	const buyerView = route.params.view === 'buying'
	const goBack = () => navigation.goBack()
	const isFocused = useIsFocused()
	const { profile } = useContext(ProfileContext)
	const { purchase } = usePurchase(route.params.saleId, isFocused)
	const { profile: profile2 } = useProfile(buyerView ? purchase?.seller_id : purchase?.buyer_id)
	const seller = !buyerView ? profile : profile2
	const { customer: customerProfile } = useCustomer(purchase?.customer_id)
	const { customer: sellerCustomerProfile } = useCustomer(seller?.customer_id, isFocused)
	const [loading, setLoading] = useState(false)

	function handleRefundPrompt() {
		Alert.alert('Cancel & refund?', 'Are you sure you want to cancel this sale and refund the full amount?', [
			{ text: 'No' },
			{
				text: 'Yes',
				onPress: () => handleRefund()
			}
		])
	}

	async function handleRefund() {
		try {
			setLoading(true)
			const refund = await api.apisauce.post('/stripe/refund/create', { id: purchase.payment_id })
			if (!refund.ok) throw new Error(refund.originalError.response.data)
			const { error: saleError } = await supabase.from('sales').delete().eq('id', purchase.id)
			if (saleError) throw new Error(saleError.message)
			const { error: listingError } = await supabase.from('listings').update({ sold_at: null, status: 'active' }).eq('id', purchase.listing_id)
			if (listingError) throw new Error(listingError.message)
			goBack()
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="Order Status" leftIcon="back" onLeftPress={goBack} />
				<ScrollView className="bg-gray-100">
					<View className="bg-white mb-3">
						<ShippingStatus navigation={navigation} sale={purchase} view={route.params.view} />
						<DeliveryStatus navigation={navigation} sale={purchase} view={route.params.view} />
						<RatingStatus navigation={navigation} sale={purchase} view={route.params.view} />
						<CompleteStatus view={route.params.view} sale={purchase} />
					</View>
					<View className="bg-white p-4">
						<Text className="text-lg font-semibold mb-3 text-gray-700">Shipping Information</Text>

						{sellerCustomerProfile && !buyerView && (
							<>
								<Text className="text-sm font-semibold mb-3">Ship from</Text>
								<View className="mb-6 flex flex-row justify-between">
									<Address address={sellerCustomerProfile?.shipping?.address} name={sellerCustomerProfile?.shipping?.name} />

									<Button
										onPress={() => navigation.navigate('addresses')}
										className="self-start"
										preset="default"
										text={sellerCustomerProfile?.shipping?.address ? 'Edit' : 'Add address'}
									/>
								</View>
							</>
						)}
						<Text className="text-sm font-semibold mb-3">Ship to</Text>
						<View className="mb-6">
							<Address address={purchase?.shipping_address.address} name={purchase?.shipping_address.name} />
						</View>
						<View>
							<Text className="text-sm font-semibold mb-3">Tracking</Text>
							{purchase?.tracking_number ? (
								<Button onPress={() => trackShipping(purchase)} preset="filled" text="Track Shipment" />
							) : (
								<Text className="mb-1 text-gray-500">Tracking information will be available once the seller adds tracking information</Text>
							)}
						</View>
					</View>
					{purchase && buyerView && <SellerSection navigation={navigation} listing={purchase.listing} />}
					{purchase && !buyerView && <SellerSection navigation={navigation} sale={purchase} />}
					<View className="bg-white p-4 mt-3">
						<Text className="text-lg font-semibold mb-3 text-gray-700">{buyerView ? 'Order' : 'Sale'} Summary</Text>
						{purchase && (
							<PurchaseCard disabled view={route.params.view} showStatus={false} showFullTime single showSold={false} item={purchase} navigation={navigation} />
						)}
					</View>
					{purchase && (
						<>
							<View className="bg-white p-4 mb-3">
								<View className="flex flex-row justify-between items-center mb-2">
									<Text className="text-sm text-gray-500 font-medium">Item price</Text>
									<Text className="text-base text-gray-500 font-normal">{formatPrice(purchase.price)}</Text>
								</View>
								<View className="flex flex-row justify-between items-center mb-2">
									<Text className="text-sm text-gray-500 font-medium">Shipping</Text>
									<Text className="text-base text-gray-500 font-normal">{formatPrice(purchase.shipping_price)}</Text>
								</View>
								<View className="flex flex-row justify-between items-center mb-2">
									<Text className="text-sm text-gray-500 font-medium">Coupon</Text>
									<Text className="text-base text-gray-500 font-normal">{formatPrice(0)}</Text>
								</View>
								{route.params.view === 'selling' && (
									<View className="flex flex-row justify-between items-center mb-2">
										<Text className="text-sm text-gray-500 font-medium">Total</Text>
										<Text className="text-base text-gray-500 font-normal">{formatPrice(purchase.price + purchase.shipping_price)}</Text>
									</View>
								)}
								{route.params.view === 'selling' && (
									<View className="flex flex-row justify-between items-center mb-2">
										<Text className="text-sm text-gray-500 font-medium">Processing fee</Text>
										<Text className="text-base text-gray-500 font-normal">{formatPrice(calculateProcessingFee(purchase.price))}</Text>
									</View>
								)}
								{route.params.view === 'selling' && (
									<View className="flex flex-row justify-between items-center mb-2">
										<Text className="text-sm text-gray-500 font-medium">Platform fee</Text>
										<Text className="text-base text-gray-500 font-normal">{formatPrice(calculatePlatformFee(purchase.price))}</Text>
									</View>
								)}
								{route.params.view === 'buying' && (
									<View className="flex flex-row justify-between items-center mb-2">
										<Text className="text-base text-gray-800 font-medium">Total</Text>
										<Text className="text-base text-gray-800 font-medium">{formatPrice(purchase.price + purchase.shipping_price)}</Text>
									</View>
								)}
								{route.params.view === 'selling' && (
									<View className="flex flex-row justify-between items-center mb-2">
										<Text className="text-base text-gray-800 font-medium">You earn</Text>
										<Text className="text-base text-gray-800 font-medium">{formatPrice(calculateEarn(purchase.price, purchase.shipping_price))}</Text>
									</View>
								)}
							</View>
							<View className="bg-white p-4 mb-10">
								<Text className="text-sm font-semibold mb-3">Item ID</Text>
								<Text className="mb-1 text-gray-500">{purchase.listing_id}</Text>
							</View>
							<View className="bg-white p-4 mb-10">
								<Text className="text-sm font-semibold mb-3">Cancel & refund</Text>
								<Button onPress={handleRefundPrompt} text="Refund" />
							</View>
						</>
					)}
				</ScrollView>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
}

function purchaseStatus(status: Sale['status']) {
	if (status === 'awaiting shipping') return 1
	if (status === 'shipped') return 2
	if (status === 'delivered') return 3
	if (status === 'complete') return 4
	else return 5
}

interface ShippingStatusProps {
	view: 'buying' | 'selling'
	navigation: StackNavigationProp<any>
	sale?: SaleWithListing
}

function ShippingStatus({ view, navigation, sale }: ShippingStatusProps) {
	if (purchaseStatus(sale?.status) > 1) {
		return (
			<View className="border-l-[2px] px-5 ml-6 mt-5 pb-2 border-l-flip-100 relative flex-row justify-between">
				<Text className="text-base font-semibold text-gray-500 -mt-[6px]">Shipped</Text>
				<Text className="text-xs">{sale?.shipped_at ? format(new Date(sale?.shipped_at), `MM/dd/yyyy`) : ''}</Text>
				<View className="absolute -left-[7px] h-3 w-3 bg-flip-100 rounded-full"></View>
			</View>
		)
	}
	if (view === 'buying') {
		return (
			<View className="bg-gray-100 px-6 pt-6">
				<View className="border-l-[2px] pl-5 pb-5 border-l-gray-300 relative">
					<Text className="text-2xl text-gray-700 font-semibold mb-5 -mt-1">Shipping soon</Text>
					<Text className="text-base mb-1 text-gray-700 font-semibold">Thanks for your purchase!</Text>
					<Text className="text-base text-gray-700 ">We'll let you know when your item is on it's way.</Text>
					<View className="absolute -left-[13px] top-0 h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
			</View>
		)
	} else {
		return (
			<View className="bg-gray-100 px-6 pt-6">
				<View className="border-l-[2px] pl-5 pb-5 border-l-gray-300 relative">
					<Text className="text-2xl text-gray-700 font-semibold mb-5 -mt-1">Shipping soon</Text>
					<Text className="text-base mb-1 text-gray-700 font-semibold">Pack it up.</Text>
					<Text className="text-base text-gray-700 mb-4">Please ship your item</Text>
					<Button onPress={() => navigation.navigate('add-tracking-screen', { saleId: sale?.id })} preset="filled" text="Confirm Shipment" />
					<View className="absolute -left-[13px] top-0 h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
			</View>
		)
	}
}

interface DeliveryStatusProps {
	view: 'buying' | 'selling'
	navigation: StackNavigationProp<any>
	sale?: SaleWithListing
}

function DeliveryStatus({ view, sale }: DeliveryStatusProps) {
	if (purchaseStatus(sale?.status) > 2) {
		return (
			<View className="border-l-[2px] px-5 ml-6 pt-2 pb-3 border-l-flip-100 relative flex-row items-center justify-between">
				<Text className="text-base font-semibold text-gray-500">Delivered</Text>
				<Text className="text-xs">{sale?.delivered_at ? format(new Date(sale?.delivered_at), `MM/dd/yyyy`) : ''}</Text>
				<View className="absolute -left-[7px] top-[15px] h-3 w-3 bg-flip-100 rounded-full"></View>
			</View>
		)
	}
	if (purchaseStatus(sale?.status) < 2) {
		return (
			<View className="border-l-[2px] px-5 ml-6 pt-5 border-l-gray-300 relative">
				<Text className="text-base font-semibold text-gray-500 -mt-[6px]">Delivery</Text>
				<View className="absolute -left-[7px] top-5 h-3 w-3 bg-gray-300 rounded-full"></View>
			</View>
		)
	}
	if (view === 'buying' && purchaseStatus(sale?.status) === 2) {
		return (
			<View className="bg-gray-100 px-6">
				<View className="border-l-[2px] pl-5 pt-6 -mb-[2px] border-l-flip-100 relative">
					<Text className="text-2xl text-gray-700 font-semibold">On it's way</Text>
					<View className="absolute -left-[13px] top-[30px] h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
				<View className="border-l-[2px] pl-5 pb-5 border-l-gray-300 relative">
					<Text className="text-base mb-1 text-gray-700 font-semibold mt-5">Get ready.</Text>
					<Text className="text-base text-gray-700 mb-4">You're package is on it's way to you</Text>
					<Button onPress={() => trackShipping(sale)} preset="filled" text="Track Shipment" />
				</View>
			</View>
		)
	}
	if (view === 'selling' && purchaseStatus(sale?.status) === 2) {
		return (
			<View className="bg-gray-100 px-6">
				<View className="border-l-[2px] pl-5 pt-6 -mb-[2px] border-l-flip-100 relative">
					<Text className="text-2xl text-gray-700 font-semibold">On it's way</Text>
					<View className="absolute -left-[13px] top-[30px] h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
				<View className="border-l-[2px] pl-5 pb-5 border-l-gray-300 relative">
					<Text className="text-base mb-1 text-gray-700 font-semibold mt-5">Sit back.</Text>
					<Text className="text-base text-gray-700 mb-4">You're package is on it's way to the buyer</Text>
					<Button onPress={() => trackShipping(sale)} preset="filled" text="Track Shipment" />
				</View>
			</View>
		)
	} else return null
}

interface RatingStatusProps {
	view: 'buying' | 'selling'
	navigation: StackNavigationProp<any>
	sale?: SaleWithListing
}

function RatingStatus({ view, sale, navigation }: RatingStatusProps) {
	if (purchaseStatus(sale?.status) > 3) {
		return (
			<View className="border-l-[2px] px-5 ml-6 pb-3 pt-2 border-l-flip-100 relative flex-row items-center justify-between">
				<Text className="text-base font-semibold text-gray-500">Rated</Text>
				<Text className="text-xs">{sale?.seller_rated_at ? format(new Date(sale?.seller_rated_at), `MM/dd/yyyy`) : ''}</Text>
				<View className="absolute -left-[7px] top-[15px] h-3 w-3 bg-flip-100 rounded-full"></View>
			</View>
		)
	}
	if (purchaseStatus(sale?.status) < 3) {
		return (
			<View className="border-l-[2px] px-5 ml-6 pt-5 border-l-gray-300 relative">
				<Text className="text-base font-semibold text-gray-500 mb-3 -mt-[6px]">Rating</Text>
				<View className="absolute -left-[7px] top-5 h-3 w-3 bg-gray-300 rounded-full"></View>
			</View>
		)
	}
	if (view === 'buying' && purchaseStatus(sale?.status) === 3) {
		return (
			<View className="bg-gray-100 px-6">
				<View className="border-l-[2px] pl-5 pt-6 -mb-[2px] border-l-flip-100 relative">
					<Text className="text-2xl text-gray-700 font-semibold">Rate the seller</Text>
					<View className="absolute -left-[13px] top-[30px] h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
				<View className="border-l-[2px] pl-5 pb-5 border-l-gray-300 relative">
					<Text className="text-base mb-1 text-gray-700 font-semibold mt-5">How was it?</Text>
					<Text className="text-base text-gray-700 mb-4">Rate the seller by {format(addDays(new Date(sale?.delivered_at), 2), 'MMM Do')} so they can get paid</Text>
					<Button preset="filled" text="Rate seller" />
				</View>
			</View>
		)
	}
	if (view === 'selling' && purchaseStatus(sale?.status) === 3 && !sale?.buyer_rated_at) {
		return (
			<View className="bg-gray-100 px-6">
				<View className="border-l-[2px] pl-5 pt-6 -mb-[2px] border-l-flip-100 relative">
					<Text className="text-2xl text-gray-700 font-semibold">Rating</Text>
					<View className="absolute -left-[13px] top-[30px] h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
				<View className="border-l-[2px] pl-5 pb-5 border-l-gray-300 relative">
					<Text className="text-base text-gray-700 font-semibold mt-3">The buyer has 2 days after delivery to confirm the item is as described and submit a rating.</Text>
					<Text className="text-base mb-1 text-gray-700 font-semibold mt-5">Rate the buyer</Text>
					<Text className="text-base text-gray-700 mb-4">Let people know your experience</Text>
					<Button preset="filled" text="Rate buyer" />
				</View>
			</View>
		)
	} else return null
}

interface CompleteStatusProps {
	sale?: SaleWithListing
	view: 'buying' | 'selling'
}

function CompleteStatus({ sale, view }: CompleteStatusProps) {
	if (purchaseStatus(sale?.status) < 4) {
		return (
			<View className={`border-l-[2px] px-5 ml-6 ${purchaseStatus(sale?.status) === 2 ? 'pt-0' : 'pt-0 '} mb-3 border-l-gray-300 relative`}>
				<Text className="text-base font-semibold text-gray-500 -mb-[6px]">Complete</Text>
				<View className={`absolute -left-[7px] ${purchaseStatus(sale?.status) === 2 ? 'top-[7px]' : 'top-[7px]'} h-3 w-3 bg-gray-300 rounded-full`}></View>
			</View>
		)
	}
	if (purchaseStatus(sale?.status) === 4 && sale?.buyer_rated_at) {
		return (
			<View className="bg-gray-100 px-6">
				<View className="border-l-[2px] pl-5 pt-6 border-l-flip-100 relative">
					<Text className="text-2xl text-gray-700 -mb-1 font-semibold">Complete</Text>
					<View className="absolute -left-[13px] top-[30px] h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
				<View className="pl-5 pb-5 relative">
					<Text className="text-base text-gray-700 mb-1 mt-3">Thank you for using Hyzer Flip!</Text>
				</View>
			</View>
		)
	}
	if (purchaseStatus(sale?.status) === 4 && !sale?.buyer_rated_at) {
		return (
			<View className="bg-gray-100 px-6">
				<View className="border-l-[2px] pl-5 pt-6 border-l-flip-100 relative">
					<Text className="text-2xl text-gray-700 -mb-1 font-semibold">Complete</Text>
					<View className="absolute -left-[13px] top-[30px] h-6 w-6 bg-flip-100 rounded-full"></View>
				</View>
				<View className="pl-5 pb-5 relative">
					<Text className="text-base text-gray-700 mb-1 mt-3">Thank you for using Hyzer Flip!</Text>
					{view === 'selling' && (
						<View className="mt-3 border-t-line border-t-gray-400 pt-4">
							<Button preset="filled" text="Rate buyer" />
						</View>
					)}
				</View>
			</View>
		)
	} else return null
}

function trackShipping(sale: SaleWithListing) {
	const trackingData = getTracking(sale?.tracking_number)
	openBrowserAsync(`${trackingData.trackingUrl.replace('%s', sale.tracking_number)}`)
}
