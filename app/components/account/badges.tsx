import React, { useContext } from 'react'
import { Image, Text, View } from 'react-native'
import { ProfileContext } from '../../context/Profile'
const twentyTwentyTwo = require('./badges/2022.png')
const twentyTwentyThree = require('./badges/2023.png')
const twentyTwentyFour = require('./badges/2024.png')
const twentyTwentyFive = require('./badges/2025.png')

export default function Badges() {
	const { profile } = useContext(ProfileContext)

	function determineBadgeFromProfileCreationDate(createdAt: string): string {
		const date = new Date(createdAt)
		if (date.getFullYear() === 2022) return twentyTwentyTwo
		if (date.getFullYear() === 2023) return twentyTwentyThree
		if (date.getFullYear() === 2024) return twentyTwentyFour
		if (date.getFullYear() === 2025) return twentyTwentyFive
		return twentyTwentyTwo
	}
	return (
		<View>
			<Text className="text-lg mb-2 font-semibold text-gray-800">Seller Badges</Text>
			<View className="flex-row items-center">
				<View className="items-center">
					<View className="h-12 w-12 bg-gray-200 rounded-full items-center mb-1 justify-center">
						{/* @ts-ignore */}
						<Image source={determineBadgeFromProfileCreationDate(profile?.created_at)} resizeMode="contain" className="h-6 w-6" />
					</View>
					<Text className="text-gray-800">Member</Text>
					<Text className="text-gray-800">since</Text>
				</View>
			</View>
		</View>
	)
}
