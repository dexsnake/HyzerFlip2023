import { useState } from '@hookstate/core'
import React from 'react'
import { Image, View, Text } from 'react-native'
import { checkoutStore } from '../../state/checkout-state'

export default function ItemOverview() {
	const { listing } = useState(checkoutStore)
	const item = listing.value

	return (
		<View className="bg-white p-4 border-b-line border-b-gray-300">
			<View className="flex-row items-center">
				<Image source={{ uri: item.images[0], cache: 'force-cache' }} className="h-[100px] w-[100px] rounded" />
				<View className="ml-3">
					<Text className="text-xl font-light mb-1">{item.title}</Text>
					<Text className="font-semibold text-lg">${item.price}</Text>
				</View>
			</View>
		</View>
	)
}
