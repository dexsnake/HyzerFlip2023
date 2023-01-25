import { useState } from '@hookstate/core'
import React, { useRef } from 'react'
import { Pressable, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native'
import { sellStore } from '../../state/sell-state'

export default function ShippingSelection() {
	const { ships_from, free_shipping, shipping_cost } = useState(sellStore)

	const shippingCostInput = useRef(null)

	const CONTAINER: ViewStyle = { marginTop: 15 }
	const DESCRIPTION: TextStyle = { fontWeight: '500', marginBottom: 15 }
	const INPUT_CONTAINER: ViewStyle = { backgroundColor: '#fff', marginHorizontal: -16, borderBottomWidth: 0.75, borderBottomColor: '#d1d5db' }
	const INPUT_WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 16 }
	const COST_INPUT_WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }
	const COST_INPUT_WRAPPER_CONTAINER: ViewStyle = { position: 'relative' }
	const INPUT: TextStyle = { paddingVertical: 16, color: '#2563EB', width: '100%' }
	const COST_INPUT: TextStyle = { paddingVertical: 16, color: '#2563EB', fontSize: 16, fontWeight: '500' }
	const SHIPPING_DOLLAR_SIGN: TextStyle = { position: 'absolute', left: -10, top: 16, color: '#2563EB', fontSize: 16, fontWeight: '500' }
	const LABEL: TextStyle = { color: '#374151', width: 80 }
	const COST_LABEL: TextStyle = { color: '#374151' }
	const RADIO_CONTAINER: ViewStyle = { flexDirection: 'row', alignItems: 'center' }
	const RADIO_WRAPPER: ViewStyle = { paddingLeft: 16, paddingVertical: 16, flexDirection: 'row' }
	const RIGHT: ViewStyle = { marginLeft: 15 }
	const RADIO_OUTER: ViewStyle = {
		borderWidth: 1,
		height: 20,
		width: 20,
		borderRadius: 50,
		borderColor: '#d1d5db'
	}
	const RADIO_OUTER_CHECKED: ViewStyle = {
		borderWidth: 2,
		height: 20,
		width: 20,
		borderRadius: 50,
		borderColor: '#2563EB',
		alignItems: 'center',
		justifyContent: 'center'
	}
	const RADIO_INNER: ViewStyle = {
		height: 10,
		width: 10,
		borderRadius: 50,
		backgroundColor: '#2563EB'
	}
	const RADIO_LABEL: TextStyle = { paddingLeft: 16, paddingTop: 16, color: '#374151' }
	const RADIO_TEXT: ViewStyle = { marginLeft: 15 }
	const NO_BORDER: ViewStyle = { borderBottomWidth: 0 }

	return (
		<View style={CONTAINER}>
			<Text style={DESCRIPTION}>Shipping</Text>
			<View style={INPUT_CONTAINER}>
				<View style={INPUT_WRAPPER}>
					<Text style={LABEL}>Ships from</Text>
					<TextInput
						value={ships_from.value}
						style={INPUT}
						maxLength={5}
						returnKeyType="done"
						placeholder="Enter zip code"
						placeholderTextColor="#d1d5db"
						keyboardType="number-pad"
						onChangeText={(text) => ships_from.set(text)}
					/>
				</View>
			</View>
			<View style={INPUT_CONTAINER}>
				<Text style={RADIO_LABEL}>Who do you want to pay for shipping?</Text>
				<View style={RADIO_WRAPPER}>
					<Pressable onPress={() => free_shipping.set(false)} style={RADIO_CONTAINER}>
						<View style={!free_shipping.value ? RADIO_OUTER_CHECKED : RADIO_OUTER}>{!free_shipping.value && <View style={RADIO_INNER}></View>}</View>
						<Text style={RADIO_TEXT}>The Buyer</Text>
					</Pressable>
					<Pressable
						onPress={() => {
							free_shipping.set(true)
							shipping_cost.set('')
						}}
						style={[RADIO_CONTAINER, RIGHT]}
					>
						<View style={free_shipping.value ? RADIO_OUTER_CHECKED : RADIO_OUTER}>{free_shipping.value && <View style={RADIO_INNER}></View>}</View>
						<Text style={RADIO_TEXT}>I'll Pay</Text>
					</Pressable>
				</View>
			</View>
			{!free_shipping.value && (
				<View style={[INPUT_CONTAINER, NO_BORDER]}>
					<Pressable onPress={() => shippingCostInput.current.focus()}>
						<View style={COST_INPUT_WRAPPER}>
							<Text style={COST_LABEL}>Shipping cost</Text>
							<View style={COST_INPUT_WRAPPER_CONTAINER}>
								<TextInput
									ref={shippingCostInput}
									value={shipping_cost.value}
									style={COST_INPUT}
									maxLength={2}
									returnKeyType="done"
									placeholder="$0"
									placeholderTextColor="#d1d5db"
									keyboardType="number-pad"
									onChangeText={(text) => shipping_cost.set(text)}
								/>
								{shipping_cost.value ? <Text style={SHIPPING_DOLLAR_SIGN}>$</Text> : null}
							</View>
						</View>
					</Pressable>
				</View>
			)}
		</View>
	)
}
