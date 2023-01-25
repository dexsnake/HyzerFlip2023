import React from 'react'
import { Image, View, Text } from 'react-native'
import Stripe from 'stripe'
import determineCardLogo from '../../../utils/determineCardLogo'
const applePayLogo = require('../../../../assets/images/apple-pay-logo.png')

interface Props {
	card?: Stripe.PaymentMethod
	applePay?: boolean
}

export default function CreditCardDisplay({ card, applePay }: Props) {
	if (applePay) {
		return (
			<View className="flex-row items-center">
				<Image source={applePayLogo} resizeMode="contain" className="h-[45px] w-[50px] mr-3" />
				<Text className="text-base font-light">Apple Pay</Text>
			</View>
		)
	}

	return (
		<View className="flex-row items-center">
			<Image source={determineCardLogo(card.card.brand)} resizeMode="contain" className="h-[30px] w-[50px] mr-3" />
			<View>
				<Text className="capitalize">
					<Text className="font-medium">{card.card.brand}</Text> ending in {card.card.last4}
				</Text>
				<Text>
					{card.card.exp_month}/{card.card.exp_year}
				</Text>
			</View>
		</View>
	)
}
