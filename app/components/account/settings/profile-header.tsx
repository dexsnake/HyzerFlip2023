import React, { useContext } from 'react'
import { Image, Text, View } from 'react-native'
import { ProfileContext } from '../../../context/Profile'
import { Button } from '../../Button'

interface Props {
	navigation: any
}

export default function ProfileHeader({ navigation }: Props) {
	const { profile } = useContext(ProfileContext)

	if (!profile) return null

	return (
		<View className="flew-xrow items-center">
			<View>
				<Image className="h-[60px] w-[60px] rounded-full" source={{ uri: profile.image_url, cache: 'force-cache' }} />
			</View>
			<View className="ml-5">
				<Text className="text-lg font-semibold text-gray-700 mb-1">
					{profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : profile.username}
				</Text>
				<Button onPress={() => navigation.navigate('profile-screen', { id: profile.id })} preset="default" text="View public profile" />
			</View>
		</View>
	)
}
