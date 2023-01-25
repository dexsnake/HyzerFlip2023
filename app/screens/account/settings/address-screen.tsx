import { useState } from '@hookstate/core'
import { StackScreenProps } from '@react-navigation/stack'
import { AddressSheet } from '@stripe/stripe-react-native'
import React, { FC } from 'react'
import { Text, View } from 'react-native'
import { Button, Header, Screen } from '../../../components'
import AddressFrom from '../../../components/forms/address-form'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import { addressStore, clearAddressStore } from '../../../state/address-state'

export const NewAddressScreen: FC<StackScreenProps<SettingsStackParamsList, 'address'>> = ({ navigation, route }) => {
	const goBack = () => {
		clearAddressStore()
		navigation.goBack()
	}

	const [visible, setVisible] = React.useState(false)

	const store = useState(addressStore)

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="New address" border={false} leftIcon="back" onLeftPress={goBack} />
				<AddressSheet
					defaultValues={{ address: { city: 'Phoenixville' } }}
					visible={visible}
					appearance={{ colors: { primary: '#2563EB', primaryText: '#1f2937', componentText: '#1f2937', placeholderText: '#9ca3af' } }}
					sheetTitle="Billing address"
					additionalFields={{ checkboxLabel: 'Billing address', phoneNumber: 'optional' }}
					onSubmit={(a) => console.log(a)}
					onError={(e) => setVisible(false)}
				/>
				<Button onPress={() => setVisible(true)} text="open" />
				{/* <View>
					<Text className="font-bold text-4xl text-center text-gray-700">{store.action.value === 'add' ? 'Add new address' : 'Edit address'}</Text>
					<Text className="text-center text-gray-700">{store.action.value === 'add' ? 'Please enter your address' : 'Please update your address'}</Text>
				</View>
				<AddressFrom navigation={navigation} /> */}
			</Screen>
		</View>
	)
}
