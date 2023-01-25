import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DiscBrandScreen } from '../../screens/sell/disc-brand-screen'
import { DiscColorScreen } from '../../screens/sell/disc-color-screen'
import { DiscConditionScreen } from '../../screens/sell/disc-condition-screen'
import { DiscTypeScreen } from '../../screens/sell/disc-type-screen'
import { SellScreen } from '../../screens/sell/sell-screen'

export type SellStackParamsList = {
	'sell-screen': undefined
	'disc-type': undefined
	'disc-brand': undefined
	'disc-condition': undefined
	'disc-color': undefined
}

const Stack = createStackNavigator<SellStackParamsList>()

export default function SellStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="sell-screen" component={SellScreen} />
			<Stack.Screen name="disc-type" component={DiscTypeScreen} />
			<Stack.Screen name="disc-brand" component={DiscBrandScreen} />
			<Stack.Screen name="disc-condition" component={DiscConditionScreen} />
			<Stack.Screen name="disc-color" component={DiscColorScreen} />
		</Stack.Navigator>
	)
}
