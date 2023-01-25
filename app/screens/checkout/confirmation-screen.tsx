import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { View, Text } from 'react-native'
import { CheckCircleIcon } from 'react-native-heroicons/outline'
import { Header, Screen } from '../../components'
import { CheckoutStackParamsList } from '../../navigators/stacks/Checkout'

export const ConfirmationScreen: FC<StackScreenProps<CheckoutStackParamsList, 'confirmation'>> = ({ navigation }) => {
	const goHome = () => navigation.navigate('home')

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header leftIcon="caretRight" border={false} onLeftPress={goHome} />
				<View className="flex-1 mt-[50%] items-center px-4">
					<CheckCircleIcon size={64} color="#10b981" />
					<Text className="text-3xl text-center font-semibold mb-2 text-gray-700">Order Confirmed</Text>
					<Text className="text-center text-gray-500 text-lg">You will receive a confirmation email shortly with your order details.</Text>
				</View>
			</Screen>
		</View>
	)
}
