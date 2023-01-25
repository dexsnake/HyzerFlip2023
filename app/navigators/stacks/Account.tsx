import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { AccountScreen } from '../../screens/account/account-screen'
import { BuyingScreen } from '../../screens/account/buying/buying-screen'
import { OrderStatusScreen } from '../../screens/account/buying/order-status-screen'
import { SellingScreen } from '../../screens/account/selling/selling-screen'
import { MyAddressesScreen } from '../../screens/account/settings/my-addresses-screen'
import { NewAddressScreen } from '../../screens/account/settings/address-screen'
import { SelectStateScreen } from '../../screens/account/settings/select-state-screen'
import { MessageScreen } from '../../screens/messages/message-screen'
import SettingsStack from './Settings'
import { BalanceScreen } from '../../screens/account/settings/balance-screen'
import { StripeInitScreen } from '../../screens/auth/stripe-init-screen'
import { AddTrackingScreen } from '../../screens/account/buying/add-tracking-screen'
import { EditAccountScreen } from '../../screens/account/settings/edit-account-screen'
import { MyPaymentMethodsScreen } from '../../screens/account/settings/my-payment-methods-screen'
import { EditProfileScreen } from '../../screens/account/settings/edit-profile-screen'
import { ProfileScreen } from '../../screens/account/settings/profile-screen'
import { ProfileAboutScreen } from '../../screens/account/settings/profile-about-screen'
import { ListingScreen } from '../../screens/listing/listing-screen'

export type AccountStackParamsList = {
	'account-screen': undefined
	'edit-account-screen': undefined
	'edit-profile-screen': undefined
	home: undefined
	'settings-stack-screen': undefined
	selling: undefined
	buying: undefined
	'order-status': { saleId: string; view: 'buying' | 'selling' }
	'profile-screen': { id: string }
	'profile-about-screen': { id: string }
	'listing-screen': { id: string }
	'add-tracking-screen': { saleId: string }
	'message-screen': { chatId?: number; user2: string; listingId: string }
	addresses: undefined
	address: { action: 'add' | 'edit' }
	'select-state': undefined
	'balance-screen': undefined
	'payment-methods-screen': undefined
	'stripe-init': { from: 'setup' | 'account' }
}

const Stack = createStackNavigator<AccountStackParamsList>()

const AccountNavigator = ({ navigation, route }) => {
	React.useLayoutEffect(() => {
		const tabHiddenRoutes = [
			'selling',
			'buying',
			'order-status',
			'message-screen',
			'addresses',
			'address',
			'balance-screen',
			'settings-stack-screen',
			'stripe-init',
			'edit-profile-screen',
			'edit-account-screen',
			'add-tracking-screen',
			'profile-screen',
			'listing-screen',
			'profile-about-screen'
		]
		const routeName = getFocusedRouteNameFromRoute(route)
		if (tabHiddenRoutes.includes(routeName)) {
			navigation.setOptions({ tabBarStyle: { display: 'none' } })
		} else {
			navigation.setOptions({ tabBarStyle: { display: 'flex' } })
		}
	}, [navigation, route])
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="account-screen" component={AccountScreen} />
			<Stack.Screen name="edit-account-screen" component={EditAccountScreen} />
			<Stack.Screen name="edit-profile-screen" component={EditProfileScreen} />
			<Stack.Screen name="settings-stack-screen" component={SettingsStack} />
			<Stack.Screen name="selling" component={SellingScreen} />
			<Stack.Screen name="buying" component={BuyingScreen} />
			<Stack.Screen name="order-status" component={OrderStatusScreen} />
			<Stack.Screen name="add-tracking-screen" component={AddTrackingScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
			<Stack.Screen name="message-screen" component={MessageScreen} />
			<Stack.Screen name="addresses" component={MyAddressesScreen} />
			<Stack.Screen name="address" component={NewAddressScreen} />
			<Stack.Screen name="payment-methods-screen" component={MyPaymentMethodsScreen} />
			<Stack.Screen name="select-state" component={SelectStateScreen} />
			<Stack.Screen name="balance-screen" component={BalanceScreen} />
			<Stack.Screen name="stripe-init" component={StripeInitScreen} />
			<Stack.Screen name="profile-screen" component={ProfileScreen} />
			<Stack.Screen name="profile-about-screen" component={ProfileAboutScreen} />
			<Stack.Screen name="listing-screen" component={ListingScreen} />
		</Stack.Navigator>
	)
}

export default AccountNavigator
