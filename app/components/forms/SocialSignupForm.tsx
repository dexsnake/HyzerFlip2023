import React, { useState } from 'react'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, TextField } from '..'
import { navigate } from '../../navigators'
import { useSignupState } from '../../state/signup-state'
import { colors } from '../../theme'

export default function SocialSignupForm() {
	const goToStripeInit = () => navigate('stripe-init', { from: 'setup' })
	const goHome = () => navigate('home')
	const [errorMessage, setErrorMessage] = useState('')

	const { set, get } = useSignupState()

	const { firstName, lastName, email, username, signupType } = get()

	async function handleNext() {
		await updateProfile()
		goToStripeInit()
	}

	const ERROR: TextStyle = {
		color: colors.error,
		marginTop: 5
	}

	const BUTTON_CONTAINER: ViewStyle = {
		marginTop: 15
	}

	const LATER_BUTTON_CONTAINER: ViewStyle = {
		marginTop: 15
	}

	const LATER_BUTTON: ViewStyle = {
		display: 'flex',
		alignItems: 'center'
	}

	const LATER_BUTTON_TEXT: TextStyle = {
		letterSpacing: 1
	}

	async function updateProfile() {
		try {
			// await db.collection('Users').doc(session.user.id).update({
			// 	firstName,
			// 	lastName,
			// 	email,
			// 	username
			// })
		} catch (error) {
			console.log(error.message)
		}
	}

	// TODO: Add validation

	return (
		<View>
			<TextField
				value={firstName}
				onChangeText={(text) => set('firstName', text)}
				label="First name"
				autoCorrect={false}
				keyboardType="default"
				textContentType="givenName"
				autoCapitalize="words"
				placeholder="John"
			/>
			<TextField
				value={lastName}
				onChangeText={(text) => set('lastName', text)}
				label="Last name"
				autoCorrect={false}
				keyboardType="default"
				textContentType="familyName"
				autoCapitalize="words"
				placeholder="Smith"
			/>
			<TextField
				value={email}
				onChangeText={(text) => set('email', text)}
				label="Email address"
				autoCorrect={false}
				editable={signupType === 'email'}
				keyboardType="email-address"
				textContentType="emailAddress"
				autoCapitalize="none"
				placeholder="name@example.com"
			/>
			<TextField
				value={username}
				onChangeText={(text) => set('username', text)}
				autoCorrect={false}
				keyboardType="default"
				autoFocus
				textContentType="username"
				autoCapitalize="none"
				label="Username"
				placeholder="3-20 character username"
			/>
			{errorMessage ? <Text style={ERROR}>{errorMessage}</Text> : null}
			<View style={BUTTON_CONTAINER}>
				<Button onPress={handleNext} text="Next" />
			</View>
			<View style={LATER_BUTTON_CONTAINER}>
				<Button preset="default" onPress={goHome} style={LATER_BUTTON} textStyle={LATER_BUTTON_TEXT} text="Setup later" />
			</View>
		</View>
	)
}
