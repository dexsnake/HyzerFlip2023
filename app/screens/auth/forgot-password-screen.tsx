import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC, useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Header, Screen, TextField } from '../../components'
import { AuthStackParamsList } from '../../navigators/stacks/Auth'

export const ForgotPasswordScreen: FC<StackScreenProps<AuthStackParamsList, 'forgot-password'>> = observer(({ navigation }) => {
	const [email, setEmail] = useState('')
	const goBack = () => navigation.goBack()
	// TODO: Hook up password reset email
	const handleSend = () => null

	return (
		<View className="flex-1">
			<Screen preset="auto" safeAreaEdges={['top', 'bottom']} backgroundColor="#fff">
				<Header border={false} leftIcon="back" onLeftPress={goBack} />
				<View className="px-4">
					<View className="mb-8">
						<Text className="text-2xl font-medium mb-1">Forgot Password?</Text>
						<Text className="">We'll send you a link to reset your password.</Text>
					</View>
					<View className="mb-4">
						<TextField
							value={email}
							onChangeText={(text) => setEmail(text)}
							label="Email address"
							autoCorrect={false}
							autoFocus
							keyboardType="email-address"
							textContentType="emailAddress"
							autoCapitalize="none"
							placeholder="name@example.com"
						/>
					</View>
					<Button onPress={handleSend} text="Send" />
				</View>
			</Screen>
		</View>
	)
})
