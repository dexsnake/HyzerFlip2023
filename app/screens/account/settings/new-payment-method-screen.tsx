import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle } from 'react-native'
import { Header, Screen } from '../../../components'
import CreditCardFrom from '../../../components/forms/credit-card-form'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import { colors, spacing } from '../../../theme'

export const NewPaymentMethodScreen: FC<StackScreenProps<SettingsStackParamsList, 'payment-methods-screen'>> = ({ navigation, route }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const FULL: ViewStyle = { flex: 1 }

	const HEADER: TextStyle = {
		paddingTop: 28,
		paddingBottom: 16,
		paddingHorizontal: 16,
		backgroundColor: '#fff'
	}
	const HEADER_TITLE: TextStyle = {
		color: '#1f2937',
		fontWeight: '500',
		textAlign: 'center',
		letterSpacing: 1.2
	}

	return (
		<View style={FULL}>
			<Screen preset="scroll" backgroundColor="#fff">
				<Header title="Add card" leftIcon="back" onLeftPress={goBack} style={HEADER} titleStyle={HEADER_TITLE} />
				<CreditCardFrom navigation={navigation} />
			</Screen>
		</View>
	)
}
