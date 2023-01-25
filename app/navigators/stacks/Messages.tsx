import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ListingScreen } from '../../screens/listing/listing-screen'
import { MessageScreen } from '../../screens/messages/message-screen'
import { MessagesScreen } from '../../screens/messages/messages-screen'

export type MessagesStackParamsList = {
	'messages-screen': undefined
	'message-screen': { chatId?: number; user2: string; listingId: string }
	'listing-screen': { id: string }
}

const Stack = createStackNavigator<MessagesStackParamsList>()

// export default function MessagesStack() {
// 	return (
// 		<Stack.Navigator screenOptions={{ headerShown: false }}>
// 			<Stack.Screen name="messages-screen" component={MessagesScreen} />
// 			<Stack.Screen name="message-screen" component={MessageScreen} />
// 			<Stack.Screen name="listing-screen" component={ListingScreen} />
// 		</Stack.Navigator>
// 	)
// }

const MessagesNavigator = ({ navigation, route }) => {
	React.useLayoutEffect(() => {
		const tabHiddenRoutes = ['message-screen', 'listing-screen']
		const routeName = getFocusedRouteNameFromRoute(route)
		if (tabHiddenRoutes.includes(routeName)) {
			navigation.setOptions({ tabBarStyle: { display: 'none' } })
		} else {
			navigation.setOptions({ tabBarStyle: { display: 'flex' } })
		}
	}, [navigation, route])
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="messages-screen" component={MessagesScreen} />
			<Stack.Screen name="message-screen" component={MessageScreen} />
			<Stack.Screen name="listing-screen" component={ListingScreen} />
		</Stack.Navigator>
	)
}

export default MessagesNavigator
