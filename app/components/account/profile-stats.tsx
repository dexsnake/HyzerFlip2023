import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { ProfileContext } from '../../context/Profile'
import useBalance from '../../hooks/useBalance'
import formatPrice from '../../utils/formatPrice'

export default function ProfileStats() {
	const { profile } = useContext(ProfileContext)
	const { balance, loading } = useBalance(profile?.merchant_id)

	return (
		<View className="my-6 flex-row items-center">
			<View className="flex-1 px-2 py-1 border-r-line border-gray-300">
				<Text className="text-center font-semibold mb-1">0</Text>
				<Text className="text-center text-sm text-gray-400">FOLLOWING</Text>
			</View>
			<View className="flex-1 px-2 py-1 border-r-line border-gray-300">
				<Text className="text-center font-semibold mb-1">0</Text>
				<Text className="text-center text-sm text-gray-400">FOLLOWERS</Text>
			</View>
			<View className="flex-1 px-2 py-1 border-r-line border-gray-300">
				<Text className="text-center font-semibold mb-1">{loading ? formatPrice(0) : formatPrice(balance.available[0].amount / 100)}</Text>
				<Text className="text-center text-sm text-gray-400">BALANCE</Text>
			</View>
			<View className="flex-1 px-2 py-1">
				<Text className="text-center font-semibold mb-1">0</Text>
				<Text className="text-center text-sm text-gray-400">COUPONS</Text>
			</View>
		</View>
	)
}
