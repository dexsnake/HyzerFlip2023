import React from 'react'
import { Text, View } from 'react-native'
import Stripe from 'stripe'

interface Props {
	address?: Stripe.Address
	name?: string
}

export default function Address({ address, name }: Props) {
	if (!address) return null
	return (
		<View>
			<Text className="mb-1">{name}</Text>
			<Text className="mb-1">{address?.line1}</Text>
			{address?.line2 && <Text className="mb-1">{address?.line2}</Text>}
			<Text className="mb-1">
				{address?.city} {address?.state}, {address?.postal_code}
			</Text>
		</View>
	)
}
