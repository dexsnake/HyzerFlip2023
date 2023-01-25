import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { View } from 'react-native'
import { Header, Screen } from '../../components'
import SignupForm from '../../components/forms/SignupForm'
import { AuthStackParamsList } from '../../navigators/stacks/Auth'

export const EmailSignupScreen: FC<StackScreenProps<AuthStackParamsList, 'email-signup'>> = observer(({ navigation }) => {
	const goBack = () => navigation.goBack()

	return (
		<View className="flex-1">
			<Screen preset="auto" safeAreaEdges={['top', 'bottom']} backgroundColor="#fff">
				<Header border={false} leftIcon="back" onLeftPress={goBack} />
				<View className="px-4">
					<SignupForm />
				</View>
			</Screen>
		</View>
	)
})
