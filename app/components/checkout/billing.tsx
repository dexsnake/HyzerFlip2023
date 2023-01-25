import React, { useContext, useEffect } from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import { CheckoutStackParamsList } from '../../navigators/stacks/Checkout'
import { StackNavigationProp } from '@react-navigation/stack'
import { useState } from '@hookstate/core'
import { checkoutStore } from '../../state/checkout-state'
import CreditCardDisplay from '../account/settings/credit-card-display'
import useCustomer from '../../hooks/useCustomer'
import { ProfileContext } from '../../context/Profile'
import { getPaymentMethod } from '../../utils/stripe/getPaymentMethod'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
const creditCards = require('./credit-cards.png')

interface Props {
	navigation: StackNavigationProp<CheckoutStackParamsList>
}

export default function Billing({ navigation }: Props) {
	const { payment, applePay } = useState(checkoutStore)
	const { profile } = useContext(ProfileContext)
	const { customer } = useCustomer(profile.customer_id)

	useEffect(() => {
		if (customer && customer.invoice_settings.default_payment_method) {
			getPaymentMethod(customer.invoice_settings.default_payment_method).then((paymentMethod) => payment.set(paymentMethod))
		}
	}, [customer])

	return (
		<View className="bg-white px-4 border-b-line border-b-gray-300">
			<Pressable className="bg-white -mx-4" onPress={() => navigation.navigate('payments')}>
				<View className="flex-row justify-between items-center p-4">
					<View className="flex-row items-center">
						<Text className="w-20 text-gray-700">Card & Billing</Text>
						{payment.value || applePay.value ? (
							<CreditCardDisplay card={payment.value} applePay={applePay.value} />
						) : (
							<View>
								<Text className="text-gray-300 mb-1">Select payment</Text>
								<Image source={creditCards} resizeMode="contain" className="h-4 w-[100px]" />
							</View>
						)}
					</View>
					<View>
						<ChevronRightIcon size={18} color="#d1d5db" />
					</View>
				</View>
			</Pressable>
		</View>
	)
}
