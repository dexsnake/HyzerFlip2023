import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext } from 'react'
import { Pressable, View, Text, Alert } from 'react-native'
import { Header, Screen } from '../../../components'
import { colors } from '../../../theme'
import { ProfileContext } from '../../../context/Profile'
import useCustomer from '../../../hooks/useCustomer'
import { useIsFocused } from '@react-navigation/native'
import { ChevronRightIcon, PlusCircleIcon } from 'react-native-heroicons/outline'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import { AddressDetails, AddressSheet } from '@stripe/stripe-react-native'
import LoadingOverlay from '../../../components/modals/loading-overlay'
import { CustomerAPI } from '../../../services/api/customer-api'

export const MyAddressesScreen: FC<StackScreenProps<SettingsStackParamsList, 'addresses'>> = ({ navigation, route }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const isFocused = useIsFocused()

	const { profile } = useContext(ProfileContext)
	const { customer } = useCustomer(profile?.customer_id, isFocused)
	const showNewAddressButton = customer && customer.address && customer.shipping?.address ? false : true
	const [visible, setVisible] = React.useState(false)
	const [addressSheetText, setAddressSheetText] = React.useState<'Billing address' | 'Shipping address' | 'New address'>('New address')
	const [addressSheetDefaultValue, setAddressSheetDefaultValue] = React.useState({})
	const [loading, setLoading] = React.useState(false)

	function handleNewAddress() {
		setAddressSheetText('New address')
		setVisible(true)
	}

	function handleShippingAddress() {
		setAddressSheetText('Shipping address')
		setVisible(true)
		setAddressSheetDefaultValue({
			address: { ...customer.shipping.address, postalCode: customer.shipping.address.postal_code },
			name: customer.shipping.name,
			phone: customer.shipping.phone
		})
	}

	function handleBillingAddress() {
		setAddressSheetText('Billing address')
		setVisible(true)
		setAddressSheetDefaultValue({ address: { ...customer.address, postalCode: customer.address.postal_code }, name: customer.name, phone: customer.phone })
	}

	function populateCustomerUpdateParams(address: AddressDetails & { target: number }) {
		const dataFormatedForApi = {
			name: address.name,
			phone: address.phone,
			address: {
				line1: address.address.line1,
				line2: address.address.line2,
				city: address.address.city,
				state: address.address.state,
				postal_code: address.address.postalCode,
				country: address.address.country
			}
		}
		if (addressSheetText === 'Shipping address') {
			return {
				shipping: dataFormatedForApi
			}
		}
		if (addressSheetText === 'Billing address') {
			return {
				address: dataFormatedForApi.address,
				name: dataFormatedForApi.name,
				phone: dataFormatedForApi.phone
			}
		} else {
			return {
				address: dataFormatedForApi.address,
				shipping: dataFormatedForApi,
				name: dataFormatedForApi.name,
				phone: dataFormatedForApi.phone
			}
		}
	}

	async function saveAddress(address: AddressDetails & { target: number }) {
		try {
			setLoading(true)
			const params = populateCustomerUpdateParams(address)
			const response = await CustomerAPI.updateCustomer(profile.customer_id, params)
			if (response.kind !== 'ok') throw new Error(response.message)
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
			setVisible(false)
		}
	}

	if (!customer) return null

	return (
		<View className="flex flex-1">
			<Screen backgroundColor="#fff">
				<Header title="My addresses" leftIcon="back" onLeftPress={goBack} />
				<View className="px-4">
					{customer?.shipping?.address && customer?.shipping?.name && (
						<Pressable onPress={handleShippingAddress} className="flex border-b-gray-300 pb-4 border-b-[0.75px] flex-row justify-between items-center">
							<View>
								<Text className="text-base font-semibold mt-3 text-gray-800 mb-3">Shipping address</Text>
								<View>
									<View className="flex flex-row items-center">
										<View className="ml-3">
											<Text className="mb-1 text-slate-800">{customer?.shipping?.name}</Text>
											<Text className="mb-1 text-slate-800">{customer?.shipping.address.line1}</Text>
											{customer.shipping.address.line2 ? <Text className="mb-1 text-slate-800">{customer?.shipping.address.line2}</Text> : null}
											<Text className="mb-1 text-slate-800">
												{customer.shipping.address.city}, {customer.shipping.address.state} {customer.shipping.address.postal_code}
											</Text>
										</View>
									</View>
								</View>
							</View>
							<ChevronRightIcon color="#9ca3af" />
						</Pressable>
					)}
					{customer?.address && customer?.name && (
						<Pressable onPress={handleBillingAddress} className="flex border-b-gray-300 pb-4 border-b-[0.75px] flex-row justify-between items-center">
							<View>
								<Text className="text-base font-semibold mt-3 mb-3 text-gray-800">Billing address</Text>
								<View>
									<View className="flex flex-row items-center">
										<View className="ml-3">
											<Text className="mb-1 text-slate-800">{customer?.name}</Text>
											<Text className="mb-1 text-slate-800">{customer.address.line1}</Text>
											{customer.address.line2 ? <Text className="mb-1 text-slate-800">{customer.address.line2}</Text> : null}
											<Text className="mb-1 text-slate-800">
												{customer.address.city}, {customer.address.state} {customer.address.postal_code}
											</Text>
										</View>
									</View>
								</View>
							</View>
							<ChevronRightIcon color="#9ca3af" />
						</Pressable>
					)}
					{showNewAddressButton && (
						<View className="py-5">
							<Pressable className="flex flex-row items-center" onPress={handleNewAddress}>
								<PlusCircleIcon size={30} />
								<Text className="ml-3 font-medium text-flip-100">Add new address</Text>
							</Pressable>
						</View>
					)}
				</View>
				<AddressSheet
					defaultValues={addressSheetDefaultValue}
					visible={visible}
					appearance={{ colors: { primary: '#2563EB', primaryText: '#1f2937', componentText: '#1f2937', placeholderText: '#9ca3af' } }}
					sheetTitle={addressSheetText}
					additionalFields={{ phoneNumber: 'optional' }}
					// @ts-ignore
					onSubmit={(addressDetails) => saveAddress(addressDetails)}
					onError={() => setVisible(false)}
				/>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
}
