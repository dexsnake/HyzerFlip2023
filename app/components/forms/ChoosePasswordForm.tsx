import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, TextField } from '..'
import { navigate } from '../../navigators'
import { useSignupState } from '../../state/signup-state'
import { supabase } from '../../clients/supabase'
import { initAccountSetup } from '../../utils/auth/initAccountSetup'
import LoadingOverlay from '../modals/loading-overlay'

export default function ChoosePasswordForm() {
	const [errorMessage, setErrorMessage] = useState('')
	const [loading, setLoading] = useState(false)

	const { set, get } = useSignupState()

	const { email, password1: password, password2, firstName, lastName, username } = get()

	async function handleSignup() {
		try {
			setLoading(true)
			const { data } = await supabase.auth.signUp({ email, password })
			await initAccountSetup(data.user.id, email, { givenName: firstName, familyName: lastName }, username)
			setErrorMessage('')
			navigate('stripe-init', { from: 'setup' })
		} catch (error) {
			setErrorMessage(error.message)
		} finally {
			setLoading(false)
		}
	}

	// TODO: Add validation for same password

	return (
		<View>
			<View className="mb-4">
				<TextField
					onChangeText={(text) => set('password1', text)}
					label="Create a password"
					autoCorrect={false}
					value={password}
					autoFocus
					keyboardType="default"
					textContentType="password"
					autoCapitalize="none"
					secureTextEntry
					placeholder="Type your password"
				/>
			</View>
			<View className="mb-4">
				<TextField
					onChangeText={(text) => set('password2', text)}
					label="Confirm your password"
					autoCorrect={false}
					value={password2}
					keyboardType="default"
					autoCapitalize="none"
					secureTextEntry
					textContentType="password"
					placeholder="Confirm your password"
				/>
			</View>

			{errorMessage ? <Text className="mb-1 text-red-500">{errorMessage}</Text> : null}
			<Button onPress={handleSignup} text="Next" />

			<LoadingOverlay show={loading} />
		</View>
	)
}
