import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { Header, Screen } from '../../components'
import SocialSignupForm from '../../components/forms/SocialSignupForm'
import { AuthStackParamsList } from '../../navigators/stacks/Auth'

export const SocialSignupScreen: FC<StackScreenProps<AuthStackParamsList, 'social-signup'>> = observer(({ navigation }) => {
	const FULL: ViewStyle = { flex: 1 }
	const CONTAINER: ViewStyle = {
		paddingHorizontal: 16
	}
	const HEADER: TextStyle = {
		paddingTop: 12,
		paddingBottom: 20
	}
	const TEXT: TextStyle = {
		color: '#1f2937'
	}
	const BOLD: TextStyle = { fontWeight: 'bold' }
	const HEADER_TITLE: TextStyle = {
		...TEXT,
		...BOLD,
		fontSize: 12,
		lineHeight: 15,
		textAlign: 'center',
		letterSpacing: 1.5
	}
	return (
		<View style={FULL}>
			<Screen style={CONTAINER} preset="scroll" backgroundColor="#fff">
				<Header style={HEADER} title="Profile information" titleStyle={HEADER_TITLE} />
				<SocialSignupForm />
			</Screen>
		</View>
	)
})
