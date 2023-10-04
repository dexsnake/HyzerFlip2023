import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState } from 'react'
import { Alert, View } from 'react-native'
import { Button, Header, Screen, TextField } from '../../../components'
import LoadingOverlay from '../../../components/modals/loading-overlay'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import { supabase } from '../../../clients/supabase'
import { delay } from '../../../utils/delay'
import useAuth from '../../../hooks/useAuth'

export const EditAccountScreen: FC<StackScreenProps<SettingsStackParamsList, 'edit-account-screen'>> = ({ navigation }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const { session } = useAuth()

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)

	async function changePassword() {
		try {
			setLoading(true)
			if (password !== confirmPassword) throw new Error('Passwords do not match')
			const { error } = await supabase.auth.updateUser({ password })
			if (error) throw new Error(error.message)
			await delay(2000)
			goBack()
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View className="flex flex-1">
			<Screen backgroundColor="#fff">
				<Header title="Edit account" leftIcon="back" onLeftPress={goBack} />
				<View className="px-4">
					<TextField
						onChangeText={setPassword}
						label="Email address"
						autoCorrect={false}
						editable={false}
						keyboardType="default"
						textContentType="emailAddress"
						autoCapitalize="none"
						placeholder={session?.user.email}
					/>
					<TextField
						onChangeText={setPassword}
						label="New password"
						autoCorrect={false}
						value={password}
						keyboardType="default"
						textContentType="password"
						autoCapitalize="none"
						secureTextEntry
						placeholder="Type your password"
					/>
					<TextField
						onChangeText={setConfirmPassword}
						label="Confirm password"
						autoCorrect={false}
						value={confirmPassword}
						keyboardType="default"
						autoCapitalize="none"
						secureTextEntry
						textContentType="password"
						placeholder="Confirm your password"
					/>
					<Button onPress={changePassword} text="Save changes" />
				</View>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
}
