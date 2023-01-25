import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { LikesScreen } from '../../screens/likes/likes-screen'
import { ListingScreen } from '../../screens/listing/listing-screen'

export type LikesStackParamsList = {
	'likes-screen': undefined
	'listing-screen': { id: string }
}

const Stack = createStackNavigator<LikesStackParamsList>()

export default function LikesStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="likes-screen" component={LikesScreen} />
			<Stack.Screen name="listing-screen" component={ListingScreen} />
		</Stack.Navigator>
	)
}
