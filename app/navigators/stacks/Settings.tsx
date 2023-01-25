import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { SettingsScreen } from '../../screens/account/settings/settings-screen'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { AccountStackParamsList } from './Account'

export type SettingsStackParamsList = AccountStackParamsList & {
	'settings-screen': undefined
}

const Stack = createStackNavigator<SettingsStackParamsList>()

const SettingsNavigator = ({ navigation, route }) => {
	React.useLayoutEffect(() => {
		const tabHiddenRoutes = ['']
		const routeName = getFocusedRouteNameFromRoute(route)
		if (tabHiddenRoutes.includes(routeName)) {
			navigation.setOptions({ tabBarStyle: { display: 'none' } })
		} else {
			navigation.setOptions({ tabBarStyle: { display: 'flex' } })
		}
	}, [navigation, route])
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="settings-screen" component={SettingsScreen} />
		</Stack.Navigator>
	)
}

export default SettingsNavigator
