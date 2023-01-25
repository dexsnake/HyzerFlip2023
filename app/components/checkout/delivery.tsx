import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { CheckoutStackParamsList } from '../../navigators/stacks/Checkout'
import { StackNavigationProp } from '@react-navigation/stack'
import Stripe from 'stripe'
import Address from '../address'
import { ChevronRightIcon } from 'react-native-heroicons/outline'

interface Props {
	navigation: StackNavigationProp<CheckoutStackParamsList>
	customer: Stripe.Customer
}

export default function Delivery({ navigation, customer }: Props) {
	const address = customer?.shipping?.address

	return (
		<View className="bg-white px-4 border-b-line border-b-gray-300">
			<Text className="text-lg font-semibold text-gray-800 my-6">Order summary</Text>
			<Pressable className="bg-white -mx-4" onPress={() => navigation.navigate('addresses', { from: 'checkout' })}>
				<View className="flex-row justify-between items-center p-4">
					<View className="flex-row items-center">
						<Text className="w-20 text-gray-700">Deliver to</Text>
						{address ? <Address address={customer?.shipping.address} name={customer?.shipping.name} /> : <Text className="text-gray-300">Select address</Text>}
					</View>
					<View>
						<ChevronRightIcon size={18} color="#d1d5db" />
					</View>
				</View>
			</Pressable>
		</View>
	)
}
