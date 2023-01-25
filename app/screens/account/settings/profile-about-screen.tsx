import { StackScreenProps } from '@react-navigation/stack'
import { getYear } from 'date-fns'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Alert, View, Image, Pressable, Text, ActionSheetIOS, FlatList } from 'react-native'
import { CalendarIcon, TagIcon } from 'react-native-heroicons/outline'
import { StarIcon } from 'react-native-heroicons/solid'
import { Header, Screen } from '../../../components'
import Badges from '../../../components/account/badges'
import ProfileStars from '../../../components/listing/ProfileStars'
import PostCard from '../../../components/post-card/post-card'
import PostCardHorizontal from '../../../components/post-card/post-card-horizontal'
import { ProfileContext } from '../../../context/Profile'
import useProfile from '../../../hooks/useProfile'
import useProfileListings from '../../../hooks/useProfileListings'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'

export const ProfileAboutScreen: FC<StackScreenProps<SettingsStackParamsList, 'profile-about-screen'>> = ({ navigation, route }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const { profile, reviews, sales, sellReviews, buyReviews, completedSales, averageSellReivew, averageBuyReivew } = useProfile(route.params.id)
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
				<Header border={false} leftIcon="back" rightIcon="debug" onLeftPress={goBack} onRightPress={handleOpenMenu} />
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
					<View className="mb-2">
						<Text className="text-lg font-semibold">About</Text>
					</View>
					<View className="flex-row gap-2 items-center mb-2">
						<CalendarIcon color="#374151" />
						<Text className="text-gray-800">Member since {getYear(new Date(profile?.created_at))}</Text>
					</View>
					<View className="flex-row gap-2 items-center mb-6">
						<TagIcon color="#374151" />
						<Text className="font-bold text-gray-800">
							{listings.length}{' '}
							<Text className="font-normal">
								items listed, <Text className="font-bold">{sales.length} </Text>
								<Text className="font-normal">sold</Text>
							</Text>
						</Text>
					</View>
					<View className="mb-6">
						<Badges />
					</View>
					<View className="flex-row justify-between items-center mb-6">
						<Text className="text-lg font-semibold">Reviews from buyers ({sellReviews.length})</Text>
						<View className="flex-row gap-1 items-center">
							<StarIcon color="#2563EB" size={20} />
							<Text className="text-lg font-semibold">{averageSellReivew}</Text>
						</View>
					</View>
					<View className="flex-row justify-between items-center">
						<Text className="text-lg font-semibold">Reviews from sellers ({buyReviews.length})</Text>
						<View className="flex-row gap-1 items-center">
							<StarIcon color="#2563EB" size={20} />
							<Text className="text-lg font-semibold">{averageBuyReivew}</Text>
						</View>
					</View>
				</View>
			</Screen>
		</View>
	)
}
