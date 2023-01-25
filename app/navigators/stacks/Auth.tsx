import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ChoosePasswordScreen } from '../../screens/auth/choose-password-screen'
import { EmailSignupScreen } from '../../screens/auth/email-signup-screen'
import { ForgotPasswordScreen } from '../../screens/auth/forgot-password-screen'
import { LoginScreen } from '../../screens/auth/login-screen'
import { SignupScreen } from '../../screens/auth/signup-screen'
import { SocialSignupScreen } from '../../screens/auth/social-signup-screen'
import { StripeInitScreen } from '../../screens/auth/stripe-init-screen'

export type AuthStackParamsList = {
	signup: undefined
	'social-signup': undefined
	'email-signup': undefined
	'choose-password': undefined
	login: undefined
	'forgot-password': undefined
	'stripe-init': { from: 'setup' | 'account' }
	home: undefined
}

const Stack = createStackNavigator<AuthStackParamsList>()

export default function AuthStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="signup" component={SignupScreen} />
			<Stack.Screen name="email-signup" component={EmailSignupScreen} />
			<Stack.Screen name="social-signup" component={SocialSignupScreen} />
			<Stack.Screen name="choose-password" component={ChoosePasswordScreen} />
			<Stack.Screen name="login" component={LoginScreen} />
			<Stack.Screen name="forgot-password" component={ForgotPasswordScreen} />
			<Stack.Screen name="stripe-init" component={StripeInitScreen} />
		</Stack.Navigator>
	)
}
