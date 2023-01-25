import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { MessageScreen } from '../../screens/messages/message-screen'
import { Listing, Profile } from '../../../types'
import { ProfileScreen } from '../../screens/account/settings/profile-screen'
import { ProfileAboutScreen } from '../../screens/account/settings/profile-about-screen'
import { ListingScreen } from '../../screens/listing/listing-screen'

export type ListingStackParamsList = {
	'listing-screen': { id: string }
	'message-screen': { sellerProfile: Profile; listing: Listing }
	'profile-screen': { id: string }
	'profile-about-screen': { id: string }
}

const Stack = createStackNavigator<ListingStackParamsList>()

export default function ListingStack({ route }) {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen initialParams={{ id: route.params.id }} name="listing-screen" component={ListingScreen} />
			<Stack.Screen name="message-screen" component={MessageScreen} />
			<Stack.Screen name="profile-screen" component={ProfileScreen} />
			<Stack.Screen name="profile-about-screen" component={ProfileAboutScreen} />
		</Stack.Navigator>
	)
}
