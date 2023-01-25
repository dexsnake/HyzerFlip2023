import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import { formatDistanceToNowStrict } from 'date-fns'
import React, { FC, useContext } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, Text, View } from 'react-native'
import { Header, Screen } from '../../components'
import { ProfileContext } from '../../context/Profile'
import useProfile from '../../hooks/useProfile'
import { MessagesStackParamsList } from '../../navigators/stacks/Messages'
import { Profile } from '../../../types'
import useChats, { ChatWithListing } from '../../hooks/useChats'

export const MessagesScreen: FC<StackScreenProps<MessagesStackParamsList, 'messages-screen'>> = ({ navigation }) => {
	const { profile } = useContext(ProfileContext)
	const { chats, loading, error } = useChats(profile.id)

	return (
		<Screen backgroundColor="#fff">
			<Header title="Messages" />
			{loading && <ActivityIndicator />}
			{error && <Text className="text-red-500">{error}</Text>}
			<FlatList
				data={chats}
				keyExtractor={(chat) => `chat-${chat.id}`}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => <ChatItem profile={profile} chat={item} navigation={navigation} />}
			/>
		</Screen>
	)
}

interface ChatItemProps {
	chat: ChatWithListing
	navigation: StackNavigationProp<MessagesStackParamsList>
	profile: Profile
}

const ChatItem = ({ chat, navigation, profile }: ChatItemProps) => {
	const { profile: user2 } = useProfile(chat.user_1 === profile.id ? chat.user_2 : chat.user_1)
	return (
		<Pressable
			onPress={() => navigation.navigate('message-screen', { chatId: chat.id, user2: chat.user_1 === profile.id ? chat.user_2 : chat.user_1, listingId: chat.listing_id })}
		>
			<View className="bg-white flex flex-row items-center p-3 border-b-[0.75px] border-b-slate-200">
				<View style={{ position: 'relative' }}>
					<Image source={{ uri: chat.listing.images[0], cache: 'force-cache' }} style={{ height: 75, width: 75, borderRadius: 4 }} />
					{chat.listing.status === 'sold' && (
						<Text style={{ position: 'absolute', top: 0, left: 0, fontSize: 8, backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 10, color: '#fff' }}>SOLD</Text>
					)}
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
					<View style={{ paddingHorizontal: 10, maxWidth: '80%' }}>
						<Text numberOfLines={1} style={{ marginBottom: 4 }}>
							{chat.last_message}
						</Text>
						<Text className="text-gray-500">{user2?.username}</Text>
					</View>
					<View>
						<Text style={{ fontSize: 10 }}>{formatDistanceToNowStrict(new Date(chat.updated_at), { addSuffix: true })}</Text>
					</View>
				</View>
			</View>
		</Pressable>
	)
}
