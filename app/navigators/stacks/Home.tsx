import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { HomeScreen } from '../../screens/home/home-screen'
import { ListingScreen } from '../../screens/listing/listing-screen'
import { AppStackParamList } from './App'

export type HomeStackParamsList = AppStackParamList & {
	welcome: undefined
	'listing-screen': { id: string }
}

const Stack = createStackNavigator<HomeStackParamsList>()

export default function HomeStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="welcome" component={HomeScreen} />
			<Stack.Screen name="listing-screen" component={ListingScreen} />
		</Stack.Navigator>
	)
}
