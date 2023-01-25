import React from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import BottomTabs from '../tabs/Main'
import AuthStack from './Auth'
import SellStack from './Sell'
import CheckoutStack from './Checkout'
import ListingStack from './Listing'
import SettingsStack from './Settings'
import EditListingStack from './EditListing'
import { Listing } from '../../../types'

export type AppStackParamList = {
	root: undefined
	auth: undefined
	list: undefined
	listing: { id: string }
	'edit-listing': { listing: Listing }
	checkout: undefined
	settings: undefined
}

const Stack = createStackNavigator<AppStackParamList>()

export default function AppStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="root" component={BottomTabs} />
			<Stack.Screen name="auth" component={AuthStack} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
			<Stack.Screen name="list" component={SellStack} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
			<Stack.Screen name="edit-listing" component={EditListingStack} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
			<Stack.Screen name="listing" component={ListingStack} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
			<Stack.Screen name="settings" component={SettingsStack} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />
			<Stack.Screen name="checkout" component={CheckoutStack} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
		</Stack.Navigator>
	)
}
