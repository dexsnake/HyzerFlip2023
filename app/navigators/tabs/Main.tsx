/* eslint-disable react/display-name */
import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { EventArg, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import HomeStack from '../stacks/Home'
import LikesStack from '../stacks/Likes'
import SellStack from '../stacks/Sell'
import MessagesStack from '../stacks/Messages'
import AccountStack from '../stacks/Account'
import OneSignal from 'react-native-onesignal'
import { HomeIcon, HeartIcon, CameraIcon, ChatBubbleBottomCenterIcon, UserIcon } from 'react-native-heroicons/outline'
import {
	HomeIcon as HomeIconSolid,
	HeartIcon as HeartIconSolid,
	CameraIcon as CameraIconSolid,
	ChatBubbleBottomCenterIcon as ChatBubbleBottomCenterIconSolid,
	UserIcon as UserIconSolid
} from 'react-native-heroicons/solid'
import { AuthContext } from '../../context/Auth'
import { Reactotron } from '../../services/reactotron/reactotronClient'
import { useStores } from '../../models'
import useAuth from '../../hooks/useAuth'

type MainTabParamList = {
	'home-stack': undefined
	'likes-stack': undefined
	'sell-stack': undefined
	'messages-stack': undefined
	'account-stack': undefined
}

interface TabIconProps {
	routeName: string
	focused: boolean
}

function TabIcon({ routeName, focused }: TabIconProps) {
	if (routeName === 'home') return focused ? <HomeIconSolid size={26} color="#2563EB" /> : <HomeIcon size={26} color="#9ca3af" />
	if (routeName === 'likes') return focused ? <HeartIconSolid size={26} color="#2563EB" /> : <HeartIcon size={26} color="#9ca3af" />
	if (routeName === 'sell') return focused ? <CameraIconSolid size={26} color="#2563EB" /> : <CameraIcon size={26} color="#9ca3af" />
	if (routeName === 'messages') return focused ? <ChatBubbleBottomCenterIconSolid size={26} color="#2563EB" /> : <ChatBubbleBottomCenterIcon size={26} color="#9ca3af" />
	if (routeName === 'account') return focused ? <UserIconSolid size={26} color="#2563EB" /> : <UserIcon size={26} color="#9ca3af" />
	else return null
}

function getTabOptions(routeName: string, badgeCount?: number) {
	return {
		headerShown: false,
		tabBarActiveTintColor: '#2563EB',
		tabBarInactiveTintColor: '#9ca3af',
		tabBarIcon: ({ focused }) => {
			return <TabIcon routeName={routeName} focused={focused} />
		},
		tabBarBadge: badgeCount > 0 ? badgeCount : null
	}
}

function checkForAuth(routeName: string) {
	const { session } = useAuth()
	return ({ navigation }) => ({
		tabPress: (e: EventArg<'tabPress', true>) => {
			e.preventDefault()
			if (session) navigation.navigate(routeName)
			else navigation.navigate('auth')
		}
	})
}

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function BottomTabs({ route, navigation }) {
	let messageBadgeCount = 2
	const routeName = getFocusedRouteNameFromRoute(route)
	if (routeName === 'messages') messageBadgeCount = 0

	OneSignal.setNotificationOpenedHandler(({ notification }) => {
		const data = notification.additionalData as { type: 'new-message' }
		if (data.type === 'new-message') navigation.navigate('messages-stack')
	})

	return (
		<Tab.Navigator initialRouteName="home-stack">
			<Tab.Screen name="home-stack" component={HomeStack} options={{ ...getTabOptions('home'), title: 'Home' }} />
			<Tab.Screen name="likes-stack" component={LikesStack} options={{ ...getTabOptions('likes'), title: 'Likes' }} listeners={checkForAuth('likes-stack')} />
			<Tab.Screen name="sell-stack" component={SellStack} options={{ ...getTabOptions('sell'), title: 'Sell' }} listeners={checkForAuth('sell-stack')} />
			<Tab.Screen
				name="messages-stack"
				component={MessagesStack}
				options={{ ...getTabOptions('messages', messageBadgeCount), title: 'Messages' }}
				listeners={checkForAuth('messages-stack')}
			/>
			<Tab.Screen name="account-stack" component={AccountStack} options={{ ...getTabOptions('account'), title: 'Account' }} listeners={checkForAuth('account-stack')} />
		</Tab.Navigator>
	)
}
