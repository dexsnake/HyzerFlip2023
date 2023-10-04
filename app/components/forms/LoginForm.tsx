import React, { useState } from 'react'
import { Alert, Platform, Pressable, Text, View } from 'react-native'
import { Button, TextField } from '..'
import { navigate } from '../../navigators'
import { supabase } from '../../clients/supabase'
import { continueWithApple } from '../../utils/auth/continueWithApple'
import { continueWithGoogle } from '../../utils/auth/continueWithGoogle'
import LoadingOverlay from '../modals/loading-overlay'
import { Reactotron } from '../../services/reactotron/reactotronClient'

export default function SignupForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	// Call the the continueWithApple function then navigate to the home screen
	async function handleAppleButtonPress() {
		try {
			await continueWithApple()
			navigate('home-stack')
		} catch (error: any) {
			console.log(error)
		}
	}

	// Call the the continueWithGoogle function then navigate to the home screen
	async function handleGoogleButtonPress() {
		try {
			await continueWithGoogle()
			navigate('home-stack')
		} catch (error: any) {
			console.log(error)
		}
	}

	async function handleLogin() {
		try {
			if (!email) throw new Error('Please enter your email address.')
			if (!password) throw new Error('Please enter your password.')
			setLoading(true)
			const { error } = await supabase.auth.signInWithPassword({ email, password })
			if (error) throw new Error(error.message)
			setPassword('')
			setEmail('')
			navigate('home-stack')
			setLoading(false)
		} catch (error: any) {
			setErrorMessage(error.message)
			Alert.alert(error.message)
			setLoading(false)
		}
	}

	return (
		<View>
			<View className="mb-4">
				<TextField
					value={email}
					onChangeText={setEmail}
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
					value={password}
					onChangeText={setPassword}
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
}
