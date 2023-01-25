import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { MyAddressesScreen } from '../../screens/account/settings/my-addresses-screen'
import { MyPaymentMethodsScreen } from '../../screens/account/settings/my-payment-methods-screen'
import { NewAddressScreen } from '../../screens/account/settings/address-screen'
import { NewPaymentMethodScreen } from '../../screens/account/settings/new-payment-method-screen'
import { SelectStateScreen } from '../../screens/account/settings/select-state-screen'
import { CheckoutScreen } from '../../screens/checkout/checkout-screen'
import { ConfirmationScreen } from '../../screens/checkout/confirmation-screen'
import HomeStack from './Home'

export type CheckoutStackParamsList = {
	'checkout-screen': undefined
	addresses: { from: 'checkout' | 'profile' }
	address: { from?: 'checkout' | 'profile'; state?: string }
	'select-state': { selectedState: string }
	payments: undefined
	'new-payment': undefined
	confirmation: undefined
	home: undefined
}

const Stack = createStackNavigator<CheckoutStackParamsList>()

export default function CheckoutStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="checkout-screen" component={CheckoutScreen} />
			<Stack.Screen name="addresses" component={MyAddressesScreen} />
			<Stack.Screen name="payments" component={MyPaymentMethodsScreen} />
			<Stack.Screen name="new-payment" component={NewPaymentMethodScreen} />
			<Stack.Screen name="address" component={NewAddressScreen} />
			<Stack.Screen name="select-state" component={SelectStateScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
			<Stack.Screen name="confirmation" component={ConfirmationScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }} />
			<Stack.Screen name="home" component={HomeStack} />
		</Stack.Navigator>
	)
}
