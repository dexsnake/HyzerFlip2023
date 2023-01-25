import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Listing } from '../../../types'
import { SellStackParamsList } from './Sell'
import { EditListingScreen } from '../../screens/listing/edit-listing-screen'
import { DiscTypeScreen } from '../../screens/sell/disc-type-screen'
import { DiscBrandScreen } from '../../screens/sell/disc-brand-screen'
import { DiscConditionScreen } from '../../screens/sell/disc-condition-screen'
import { DiscColorScreen } from '../../screens/sell/disc-color-screen'

export type EditListingStackParamsList = SellStackParamsList & {
	'edit-listing-screen': { listing: Listing }
}

const Stack = createStackNavigator<EditListingStackParamsList>()

export default function EditListingStack({ route }) {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen initialParams={{ listing: route.params.listing }} name="edit-listing-screen" component={EditListingScreen} />
			<Stack.Screen name="disc-type" component={DiscTypeScreen} />
			<Stack.Screen name="disc-brand" component={DiscBrandScreen} />
			<Stack.Screen name="disc-condition" component={DiscConditionScreen} />
			<Stack.Screen name="disc-color" component={DiscColorScreen} />
		</Stack.Navigator>
	)
}
