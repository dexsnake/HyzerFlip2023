import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { View } from 'react-native'
import { Header, Screen } from '../../components'
import { LoginForm } from '../../components/forms/LoginForm'
import { AuthStackParamsList } from '../../navigators/stacks/Auth'

export const LoginScreen: FC<StackScreenProps<AuthStackParamsList, 'login'>> = observer(({ navigation }) => {
	const goBack = () => navigation.goBack()
	const goToForgotPassword = () => navigation.navigate('forgot-password')

	return (
		<View className="flex-1">
			<Screen preset="auto" safeAreaEdges={['top', 'bottom']} backgroundColor="#fff">
				<Header border={false} leftIcon="back" onLeftPress={goBack} rightText="Forgot password?" onRightPress={goToForgotPassword} />
				<View className="px-4">
					<LoginForm />
				</View>
			</Screen>
		</View>
	)
})
