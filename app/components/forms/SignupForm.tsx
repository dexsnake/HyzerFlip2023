import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, TextField } from '..'
import { navigate } from '../../navigators'
import { useSignupState } from '../../state/signup-state'

export default function SignupForm() {
	const goToChoosePassword = () => navigate('choose-password')
	const [errorMessage, setErrorMessage] = useState('')

	const { set, get } = useSignupState()

	const { firstName, lastName, email, username } = get()

	// TODO: Add validation

	return (
		<View>
			<View className="mb-4">
				<TextField
					value={firstName}
					onChangeText={(text) => set('firstName', text)}
					label="First name"
					autoCorrect={false}
					autoFocus
					keyboardType="default"
					textContentType="givenName"
					autoCapitalize="words"
					placeholder="John"
				/>
			</View>
			<View className="mb-4">
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
			</View>
			<View className="mb-4">
				<TextField
					value={email}
					onChangeText={(text) => set('email', text)}
					label="Email address"
					autoCorrect={false}
					keyboardType="email-address"
					textContentType="emailAddress"
					autoCapitalize="none"
					placeholder="name@example.com"
				/>
			</View>
			<View className="mb-4">
				<TextField
					value={username}
					onChangeText={(text) => set('username', text)}
					autoCorrect={false}
					keyboardType="default"
					textContentType="username"
					autoCapitalize="none"
					label="Username"
					placeholder="3-20 character username"
				/>
			</View>
			{errorMessage ? <Text className="text-red-500 mt-1">{errorMessage}</Text> : null}
			<View>
				<Button onPress={goToChoosePassword} text="Next" />
			</View>
		</View>
	)
}
