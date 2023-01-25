import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Header, Screen } from '../../../components'
import MenuButton from '../../../components/account/menu-button'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'

export const SettingsScreen: FC<StackScreenProps<SettingsStackParamsList, 'settings-screen'>> = ({ navigation }) => {
	const goBack = () => {
		navigation.goBack()
	}
	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="Settings" leftIcon="back" onLeftPress={goBack} />
				<ScrollView className="px-4 py-2">
					<MenuButton text="Edit account" onPress={() => navigation.navigate('edit-account-screen')} />
					<MenuButton text="Edit profile" onPress={() => navigation.navigate('edit-profile-screen')} />
					<MenuButton text="My addresses" onPress={() => navigation.navigate('addresses')} />
					<MenuButton text="My payment methods" onPress={() => navigation.navigate('payment-methods-screen')} />
					<MenuButton text="My balance" onPress={() => navigation.navigate('balance-screen')} />
				</ScrollView>
			</Screen>
		</View>
	)
}
