import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Alert, View, Image, Pressable, Text, ActionSheetIOS, FlatList } from 'react-native'
import { Header, Screen } from '../../../components'
import ProfileStars from '../../../components/listing/ProfileStars'
import PostCard from '../../../components/post-card/post-card'
import PostCardHorizontal from '../../../components/post-card/post-card-horizontal'
import { ProfileContext } from '../../../context/Profile'
import useProfile from '../../../hooks/useProfile'
import useProfileListings from '../../../hooks/useProfileListings'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'

export const ProfileScreen: FC<StackScreenProps<SettingsStackParamsList, 'profile-screen'>> = ({ navigation, route }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const { profile, reviews, sales, completedSales } = useProfile(route.params.id)
	const { listings } = useProfileListings(route.params.id)

	function handleOpenMenu() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Cancel', 'Share'],
				cancelButtonIndex: 0
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					// cancel action
				} else if (buttonIndex === 1) {
					ActionSheetIOS.showShareActionSheetWithOptions(
						{
							message: 'Share this profile',
							url: 'http://172.30.0.177:3000'
						},
						() => console.log('error'),
						() => console.log('success')
					)
				}
			}
		)
	}

	if (!profile && !reviews && !sales) {
		return (
			<View className="flex-1">
				<Screen backgroundColor="#fff">
					<Header border={false} leftIcon="back" onLeftPress={goBack} />
				</Screen>
			</View>
		)
	}

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header border={false} leftIcon="back" rightIcon="bell" onLeftPress={goBack} onRightPress={handleOpenMenu} />
				<View className="px-4 pt-4">
					<View className="mb-6 flex-row items-center">
						<View className="w-1/4">
							<Image className="h-20 w-20 rounded-full" source={{ uri: profile?.image_url, cache: 'force-cache' }} />
						</View>
						<View className="w-1/4">
							<Text className="text-center font-semibold text-gray-800 text-base mb-1">{sales.length}</Text>
							<Text className="text-center text-gray-500">Sold</Text>
						</View>
						<View className="w-1/4">
							<Text className="text-center font-semibold text-gray-800 text-base mb-1">0</Text>
							<Text className="text-center text-gray-500">Followers</Text>
						</View>
						<View className="w-1/4">
							<Text className="text-center font-semibold text-gray-800 text-base mb-1">0</Text>
							<Text className="text-center text-gray-500">Following</Text>
						</View>
					</View>
					<View className="mb-6">
						<Text className="text-lg font-semibold">{profile?.username}</Text>
						<ProfileStars reviews={reviews} />
						{completedSales.length > 0 && <Text className="text-xs text-gray-400">{completedSales.length} completed sales</Text>}
					</View>
					<View className="mb-6">
						<Pressable onPress={() => navigation.navigate('profile-about-screen', { id: route.params.id })} className="bg-gray-200 px-3 py-2">
							<Text className="font-semibold text-gray-800 text-center">About</Text>
						</Pressable>
					</View>
					<View className="mb-3">
						<Text className="text-lg font-semibold text-gray-800">{listings.length} items</Text>
					</View>
					<View className="-mx-[5px]">
						<FlatList
							data={listings}
							numColumns={3}
							className="flex-grow-0"
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <PostCard cols={3} item={item} navigation={navigation} />}
						/>
					</View>
				</View>
			</Screen>
		</View>
	)
}
