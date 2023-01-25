import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState, useCallback, useContext } from 'react'
import { TextStyle, ViewStyle, Image, Text, View, Pressable, ImageStyle, Alert } from 'react-native'
import { Header, Screen } from '../../components'
import { MessagesStackParamsList } from '../../navigators/stacks/Messages'
import { colors, spacing } from '../../theme'
import { Avatar, Bubble, GiftedChat } from 'react-native-gifted-chat'
import { ProfileContext } from '../../context/Profile'
import { Chat, Listing, Profile } from '../../../types'
import { supabase } from '../../clients/supabase'
import useMessages from '../../hooks/useMessages'
import useProfile from '../../hooks/useProfile'
import useListing from '../../hooks/useListing'
import useChat from '../../hooks/useChat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { api } from '../../services/api'

export const MessageScreen: FC<StackScreenProps<MessagesStackParamsList, 'message-screen'>> = ({ route, navigation }) => {
	const insets = useSafeAreaInsets()
	const [chatId, setChatId] = useState<number | undefined>(route.params.chatId)
	const { profile: user1, purchases: user1Purchases } = useContext(ProfileContext)
	const { profile: user2 } = useProfile(route.params.user2)
	const { listing } = useListing(route.params.listingId)
	const { chat } = useChat(chatId, setChatId, route.params.listingId, user1, user2)
	const { messages } = useMessages(chatId)

	const onSend = useCallback(
		async (messages = []) => {
			try {
				if (!chatId) {
					const newChat = await startNewChat(user1, user2, listing, messages)
					setChatId(newChat.id)
					addMessage(messages, newChat, user1, user2)
				} else {
					addMessage(messages, chat, user1, user2)
					updateChat(messages, chat)
				}
			} catch (error) {
				Alert.alert(error.message)
			}
		},
		[chatId, chat, user2, listing]
	)

	const goBack = () => navigation.goBack()

	return (
		<Screen backgroundColor="#fff">
			<Header onLeftPress={goBack} leftIcon="back" title={user2 ? user2.username : ''} />
			{user1 && listing && user1Purchases.filter((purchase) => purchase.listing_id === listing.id).length > 0 && <PurchasedBanner />}
			{listing && (
				<View className="mb-4">
					<ListingBanner listing={listing} navigation={navigation} />
				</View>
			)}
			<GiftedChat
				renderBubble={renderBubble}
				renderAvatar={renderAvatar}
				alwaysShowSend
				wrapInSafeArea={false}
				minComposerHeight={35}
				keyboardShouldPersistTaps="never"
				renderChatEmpty={() => renderChatEmpty(user2)}
				alignTop
				showAvatarForEveryMessage
				isKeyboardInternallyHandled={false}
				messages={messages}
				onSend={(messages) => onSend(messages)}
				user={{
					_id: user1.id,
					name: user1.username,
					avatar: user1.image_url
				}}
			/>
			<View style={{ height: insets.bottom }}></View>
		</Screen>
	)
}

const renderBubble = (props) => {
	return (
		<Bubble
			{...props}
			containerStyle={{ left: { marginBottom: 20 }, right: { marginBottom: 20 } }}
			wrapperStyle={{
				right: {
					backgroundColor: '#2563EB',
					paddingVertical: 10,
					paddingHorizontal: 5
				},
				left: {
					paddingVertical: 10,
					paddingHorizontal: 5
				}
			}}
		/>
	)
}

const renderAvatar = (props) => {
	return <Avatar {...props} containerStyle={{ left: { marginBottom: 25 } }} />
}

const renderChatEmpty = (otherProfile: Profile) => {
	return (
		<View className="items-center h-[250px]">
			<Text className="text-2xl max-w-[200px] text-slate-700 -scale-y-100">Send {otherProfile ? otherProfile.username : ''} a message:</Text>
		</View>
	)
}

const PurchasedBanner = () => {
	const CONTAINER: ViewStyle = { backgroundColor: '#2563EB', paddingVertical: 8 }
	const TEXT: TextStyle = { color: '#fff', textAlign: 'center', fontWeight: '500' }

	return (
		<View style={CONTAINER}>
			<Text style={TEXT}>You purchased this time</Text>
		</View>
	)
}

interface ListingBannerProps {
	listing: Listing
	navigation: StackNavigationProp<MessagesStackParamsList>
}

const ListingBanner = ({ listing, navigation }: ListingBannerProps) => {
	const CONTAINER: ViewStyle = { padding: 8, borderBottomWidth: 0.75, borderBottomColor: '#374151', flexDirection: 'row' }
	const IMAGE: ImageStyle = { height: 35, width: 35, borderRadius: 4 }
	const TEXT_CONTAINER: ViewStyle = { marginLeft: 10 }
	const PRICE: TextStyle = { fontWeight: '600' }

	return (
		<Pressable onPress={() => navigation.navigate('listing-screen', { id: listing.id })}>
			<View style={CONTAINER}>
				<Image source={{ uri: listing.images[0], cache: 'force-cache' }} style={IMAGE} />
				<View style={TEXT_CONTAINER}>
					<Text>{listing.title}</Text>
					<Text style={PRICE}>${listing.price}</Text>
				</View>
			</View>
		</Pressable>
	)
}

async function startNewChat(user1: Profile, user2: Profile, listing: Listing, messages) {
	try {
		const { data, error } = await supabase
			.from('chats')
			.insert({
				user_1: user1.id,
				user_2: user2.id,
				listing_id: listing.id,
				last_message: messages[0].text
			})
			.select('*')
			.single()

		if (error) {
			throw new Error(error.message)
		}
		return data
	} catch (error) {
		throw new Error(error.message)
	}
}

async function updateChat(messages, chat: Chat) {
	try {
		if (!messages) throw new Error('No messages found')
		if (!chat) throw new Error('No chat found')
		const { error } = await supabase.from('chats').update({ last_message: messages[0].text, updated_at: new Date().toISOString() }).eq('id', chat.id)
		if (error) {
			throw new Error(error.message)
		}
	} catch (error) {
		throw new Error(error.message)
	}
}

async function addMessage(messages, chat: Chat, user1: Profile, user2: Profile) {
	try {
		if (!messages) throw new Error('No messages found')
		if (!chat) throw new Error('No chat found')
		if (!user1) throw new Error('user1 not found')
		if (!user2) throw new Error('user2 not found')
		delete messages[0].createdAt
		const { data, error } = await supabase
			.from('chat_messages')
			.insert({ ...messages[0], chat_id: chat.id, from_user_id: user1.id, to_user_id: user2.id })
			.select('*')
			.single()

		if (error) {
			throw new Error(error.message)
		}
		api.apisauce.post('/notifications/new-message', { id: data.id })
	} catch (error) {
		throw new Error(error.message)
	}
}
