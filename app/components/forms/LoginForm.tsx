import React, { useEffect, useState } from 'react'
import { Alert, Platform, Pressable, Text, View } from 'react-native'
import { Button, TextField } from '..'
import { navigate } from '../../navigators'
import { supabase } from '../../clients/supabase'
import { continueWithApple } from '../../utils/auth/continueWithApple'
import { continueWithGoogle } from '../../utils/auth/continueWithGoogle'
import LoadingOverlay from '../modals/loading-overlay'
import { useStores } from '../../models'
import { observer } from 'mobx-react-lite'
import { Reactotron } from '../../services/reactotron/reactotronClient'

export const LoginForm = observer(function LoginForm() {
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const {
		authenticationStore: { authEmail, authPassword, setAuthEmail, setAuthPassword, setToken, validationErrors }
	} = useStores()

	// Call the the continueWithApple function then navigate to the home screen
	async function handleAppleButtonPress() {
		try {
			await continueWithApple()
			navigate('home')
		} catch (error: any) {
			console.log(error)
		}
		// const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'apple' })
		// console.log({ data, error })
	}

	// Call the the continueWithGoogle function then navigate to the home screen
	async function handleGoogleButtonPress() {
		try {
			await continueWithGoogle()
			navigate('home')
		} catch (error: any) {
			console.log(error)
		}
	}

	async function handleLogin() {
		try {
			if (!authEmail) throw new Error('Please enter your email address.')
			if (!authPassword) throw new Error('Please enter your password.')
			setLoading(true)
			const { data, error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
			if (error) throw new Error(error.message)
			Reactotron.log(data.session.access_token)
			setToken(data.session.access_token)
			setAuthPassword('')
			setAuthEmail('')
			navigate('home-stack')
		} catch (error: any) {
			setErrorMessage(error.message)
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View>
			<View className="mb-4">
				<TextField
					value={authEmail}
					onChangeText={setAuthEmail}
					label="Email address"
					autoCorrect={false}
					autoFocus
					keyboardType="email-address"
					textContentType="emailAddress"
					autoCapitalize="none"
					placeholder="name@example.com"
				/>
			</View>
			<View className="mb-4">
				<TextField
					value={authPassword}
					onChangeText={setAuthPassword}
					autoCorrect={false}
					secureTextEntry
					keyboardType="default"
					textContentType="password"
					autoCapitalize="none"
					label="Password"
					placeholder="6-128 character password"
				/>
			</View>
			{errorMessage ? <Text className="text-red-500 mt-1">{errorMessage}</Text> : null}
			<Button onPress={handleLogin} text="Login" />
			<Text className="text-center my-6 text-gray-400">or</Text>
			{Platform.OS === 'ios' && (
				<View className="mb-3">
					<Pressable className="bg-black py-4 rounded">
						<Text className="text-white text-center font-medium">Sign in with Apple</Text>
					</Pressable>
				</View>
			)}
			<View className="mb-3">
				<Pressable className="bg-white border border-gray-300 py-4 rounded">
					<Text className="text-center font-medium">Sign in with Google</Text>
				</Pressable>
			</View>
			<LoadingOverlay show={loading} />
		</View>
	)
})
