import { useHookstate } from '@hookstate/core'
import { StackNavigationProp } from '@react-navigation/stack'
import axios from 'axios'
import React, { useContext } from 'react'
import { View, Text, TextInput, ViewStyle, TextStyle, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Button } from '..'
import { ProfileContext } from '../../context/Profile'
import { SettingsStackParamsList } from '../../navigators/stacks/Settings'
import { api } from '../../services/api'
import { addressStore, clearAddressStore } from '../../state/address-state'
import validateAddress from '../../utils/address/validate'

interface Props {
	navigation: StackNavigationProp<SettingsStackParamsList>
}

export default function AddressFrom({ navigation }: Props) {
	const { profile } = useContext(ProfileContext)
	const store = useHookstate(addressStore)
	const [shippingChecked, setShippingChecked] = React.useState(true)
	const [billingChecked, setBillingChecked] = React.useState(true)
	const [loading, setLoading] = React.useState(false)

	async function createAddress() {
		try {
			function addressCheck() {
				if (billingChecked && shippingChecked) return [true, true]
				if (billingChecked && !shippingChecked) return [true, false]
				if (!billingChecked && shippingChecked) return [false, true]
				else return []
			}
			if (validateAddress(store.value, addressCheck())) return
			setLoading(true)
			await api.apisauce.post('/stripe/customer/address/update', {
				name: store.value.name,
				line1: store.value.line1,
				line2: store.value.line2,
				city: store.value.city,
				state: store.value.state,
				postal_code: store.value.postal_code,
				id: profile.customer_id,
				billingChecked,
				shippingChecked
			})
			clearAddressStore()
			navigation.navigate('addresses')
		} catch (error) {
			console.log(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View></View>
		// <View style={WRAPPER}>
		// 	<View style={INPUT_CONTAINER}>
		// 		<Text style={INPUT_LABEL}>Full name</Text>
		// 		<View style={FLEX1}>
		// 			<TextInput
		// 				value={store.value.name}
		// 				placeholderTextColor={color.palette.grayLighter}
		// 				onChangeText={(text) => store.name.set(text)}
		// 				placeholder="Full Name"
		// 				className={inputClasses}
		// 			/>
		// 		</View>
		// 	</View>
		// 	<View style={INPUT_CONTAINER}>
		// 		<Text style={INPUT_LABEL}>Address 1</Text>
		// 		<View style={FLEX1}>
		// 			<TextInput
		// 				value={store.value.line1}
		// 				placeholderTextColor={color.palette.grayLighter}
		// 				onChangeText={(text) => store.line1.set(text)}
		// 				placeholder="Address 1"
		// 				className={inputClasses}
		// 			/>
		// 		</View>
		// 	</View>
		// 	<View style={INPUT_CONTAINER}>
		// 		<Text style={INPUT_LABEL}>Address 2</Text>
		// 		<View style={FLEX1}>
		// 			<TextInput
		// 				value={store.value.line2}
		// 				placeholderTextColor={color.palette.grayLighter}
		// 				onChangeText={(text) => store.line2.set(text)}
		// 				placeholder="Address 2"
		// 				className={inputClasses}
		// 			/>
		// 		</View>
		// 	</View>
		// 	<View style={INPUT_CONTAINER}>
		// 		<Text style={INPUT_LABEL}>City</Text>
		// 		<View style={FLEX1}>
		// 			<TextInput
		// 				value={store.value.city}
		// 				placeholderTextColor={color.palette.grayLighter}
		// 				onChangeText={(text) => store.city.set(text)}
		// 				placeholder="City"
		// 				className={inputClasses}
		// 			/>
		// 		</View>
		// 	</View>
		// 	<View style={INPUT_CONTAINER}>
		// 		<Text style={INPUT_LABEL}>State</Text>
		// 		<Pressable onPress={() => navigation.navigate('select-state')} style={FLEX1}>
		// 			{store.state.value ? <Text style={STATE}>{store.state.value}</Text> : <Text style={STATE_PLACEHOLDER}>Select state</Text>}
		// 		</Pressable>
		// 	</View>
		// 	<View style={INPUT_CONTAINER}>
		// 		<Text style={INPUT_LABEL}>Zip code</Text>
		// 		<View style={FLEX1}>
		// 			<TextInput
		// 				value={store.value.postal_code}
		// 				placeholderTextColor={color.palette.grayLighter}
		// 				onChangeText={(text) => store.postal_code.set(text)}
		// 				placeholder="Zip code"
		// 				className={inputClasses}
		// 			/>
		// 		</View>
		// 	</View>
		// 	<View className="px-4 mt-4">
		// 		<TouchableOpacity onPress={() => setShippingChecked(!shippingChecked)} className="flex flex-row items-center gap-4 mb-4">
		// 			<CheckBox
		// 				style={{ height: 20, width: 20 }}
		// 				boxType="square"
		// 				lineWidth={1}
		// 				onCheckColor="#ffffff"
		// 				onFillColor="#2563EB"
		// 				onTintColor="#2563EB"
		// 				animationDuration={0.1}
		// 				value={shippingChecked}
		// 			/>
		// 			<Text className="text-base text-slate-800">Make this my shipping address</Text>
		// 		</TouchableOpacity>
		// 		<TouchableOpacity onPress={() => setBillingChecked(!billingChecked)} className="flex flex-row items-center gap-4 mb-4">
		// 			<CheckBox
		// 				style={{ height: 20, width: 20 }}
		// 				boxType="square"
		// 				lineWidth={1}
		// 				onCheckColor="#ffffff"
		// 				onFillColor="#2563EB"
		// 				onTintColor="#2563EB"
		// 				animationDuration={0.1}
		// 				value={billingChecked}
		// 			/>
		// 			<Text className="text-base text-slate-800">Make this my billing address</Text>
		// 		</TouchableOpacity>
		// 	</View>
		// 	<View style={BUTTON_CONTAINER}>
		// 		<Button onPress={createAddress}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={BUTTON_TEXT}>Save address</Text>}</Button>
		// 	</View>
		// </View>
	)
}
