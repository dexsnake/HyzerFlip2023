import React from 'react'
import { Text, View } from 'react-native'
import { Review } from '../../../types'
import { StarIcon } from 'react-native-heroicons/outline'

interface Props {
	reviews: Review[]
}

export default function ProfileStars({ reviews }: Props) {
	return (
		<View className="flex-row gap-1 my-1 items-center">
			<StarIcon size={14} />
			<StarIcon size={14} />
			<StarIcon size={14} />
			<StarIcon size={14} />
			<StarIcon size={14} />
			<Text>({reviews.length})</Text>
		</View>
	)
}
