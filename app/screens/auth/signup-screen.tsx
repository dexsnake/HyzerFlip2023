import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { Image, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle, Text, Platform, Pressable } from 'react-native'
import { Screen, SigninButton } from '../../components'
import { AuthStackParamsList } from '../../navigators/stacks/Auth'
import { openBrowserAsync } from 'expo-web-browser'
import { useSignupState } from '../../state/signup-state'
import { GoogleFullName } from '../../utils/auth/continueWithGoogle'
const logo = require('./logo-white.png')

export const SignupScreen: FC<StackScreenProps<AuthStackParamsList, 'signup'>> = observer(({ navigation }) => {
	const { set, clear } = useSignupState()
	const goBack = () => {
		clear()
		navigation.goBack()
	}
	const goToLogin = () => navigation.navigate('login-screen')
	const openTermsOfService = () => openBrowserAsync('https://hyzerflip.app/terms-of-service')
	const openPrivacyPolicy = () => openBrowserAsync('https://hyzerflip.app/privacy-policy')

	// Handles navigating to the next screen and setting the signupType state
	function handleGoToSignup(signupType: 'email' | 'apple' | 'google' | 'facebook') {
		set('signupType', signupType)
		if (signupType !== 'email') navigation.navigate('social-signup')
		else navigation.navigate('email-signup')
	}

	// Takes the fullName, email and appleCredentail from the continueWithApple function and sets them to the signupState
	async function setSigninState(fullName: { givenName: string; familyName: string } | GoogleFullName, email: string) {
		try {
			const firstName = fullName?.givenName || ''
			const lastName = fullName?.familyName || ''

			set('firstName', firstName)
			set('lastName', lastName)
			set('email', email)
		} catch (error) {
			throw new Error('Could not set the state')
		}
	}

	// Call the the continueWithApple function then navigate to the next screen
	async function handleAppleButtonPress() {
		try {
			// const { isNewUser, fullName, email } = await continueWithApple()
			// if (!isNewUser) {
			// 	navigation.navigate('home')
			// } else {
			// 	await setSigninState(fullName, email)
			// 	handleGoToSignup('apple')
			// }
		} catch (error: any) {
			console.log(error)
		}
	}

	// Call the the continueWithApple function then navigate to the next screen
	async function handleGoogleButtonPress() {
		try {
			// const { isNewUser, fullName, email } = await continueWithGoogle()
			// if (!isNewUser) {
			// 	navigation.navigate('home')
			// } else {
			// 	await setSigninState(fullName, email)
			// 	handleGoToSignup('google')
			// }
		} catch (error: any) {
			console.log(error)
		}
	}

	const FULL: ViewStyle = { flex: 1 }

	const CONTAINER: ViewStyle = {
		backgroundColor: 'transparent',
		paddingHorizontal: 16
	}
	const HEADER: TextStyle = {
		paddingTop: 12,
		paddingBottom: 16 + 4,
		paddingHorizontal: 0
	}
	const CANCEL: TextStyle = {
		color: '#fff',
		letterSpacing: 1,
		fontSize: 14
	}

	const HEADER_CONTAINER: ViewStyle = {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}

	const LOGIN: TextStyle = {
		borderWidth: 1,
		borderColor: '#fff',
		paddingHorizontal: 12,
		paddingVertical: 6
	}

	const LOGIN_TEXT: TextStyle = {
		color: '#fff',
		fontSize: 12,
		letterSpacing: 1
	}

	const LOGO_CONTAINER: ViewStyle = {
		display: 'flex',
		alignItems: 'center',
		marginVertical: 80
	}
	const LOGO: ImageStyle = {
		height: 75
	}

	const LOGO_TEXT: TextStyle = {
		color: '#fff',
		textAlign: 'center',
		fontSize: 16,
		letterSpacing: 1,
		marginTop: 15
	}
	const FOOTER: ViewStyle = {
		backgroundColor: '#2563EB'
	}
	const FOOTER_CONTENT: ViewStyle = {
		paddingHorizontal: 16,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 16
	}
	const FOOTER_TEXT: TextStyle = {
		width: '75%',
		color: '#fff',
		textAlign: 'center',
		fontSize: 12,
		letterSpacing: 0.5,
		lineHeight: 16
	}

	const FOOTER_TEXT_LINK: TextStyle = { textDecorationLine: 'underline' }
	const BUTTON_CONTAINER: ViewStyle = { marginTop: 10 }

	return (
		<View className="flex-1">
			<Screen preset="auto" safeAreaEdges={['bottom', 'top']} backgroundColor="#2563EB">
				<View className="px-4">
					<View style={HEADER}>
						<View style={HEADER_CONTAINER}>
							<Pressable onPress={goBack}>
								<Text className="text-white text-base font-medium">Cancel</Text>
							</Pressable>
							<Pressable onPress={goToLogin}>
								<Text className="text-white text-base font-medium">Login</Text>
							</Pressable>
						</View>
					</View>
					<View style={LOGO_CONTAINER}>
						<Image resizeMode="contain" source={logo} style={LOGO} />
						<Text style={LOGO_TEXT}>Disc Golf Marketplace</Text>
					</View>
					{Platform.OS === 'ios' && (
						<View className="mb-3">
							<Pressable className="bg-black py-4 rounded">
								<Text className="text-white text-center font-medium">Sign up with Apple</Text>
							</Pressable>
						</View>
					)}
					<View className="mb-3">
						<Pressable className="bg-white py-4 rounded">
							<Text className="text-gray-800 text-center font-medium">Sign up with Google</Text>
						</Pressable>
					</View>
					<View>
						<Pressable onPress={() => handleGoToSignup('email')} className="bg-white py-4 rounded">
							<Text className="text-gray-800 text-center font-medium">Sign up with Email</Text>
						</Pressable>
					</View>
				</View>
			</Screen>
			<SafeAreaView style={FOOTER}>
				<View style={FOOTER_CONTENT}>
					<Text style={FOOTER_TEXT}>
						By siging up or loggin in, you agree to our{' '}
						<Text onPress={openTermsOfService} style={{ ...FOOTER_TEXT, ...FOOTER_TEXT_LINK }}>
							Terms of Service
						</Text>{' '}
						and{' '}
						<Text onPress={openPrivacyPolicy} style={{ ...FOOTER_TEXT, ...FOOTER_TEXT_LINK }}>
							Privacy Policy
						</Text>
					</Text>
				</View>
			</SafeAreaView>
		</View>
	)
})
