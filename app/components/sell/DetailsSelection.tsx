import { useState } from '@hookstate/core'
import React from 'react'
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { ChevronRightIcon } from 'react-native-heroicons/outline'
import { sellStore } from '../../state/sell-state'
import { colors as themeColor, spacing } from '../../theme'

interface Props {
	navigation: any
}

export default function DetailsSelection({ navigation }: Props) {
	const { type, brand, condition, color } = useState(sellStore)

	const goToTypeScreen = () => navigation.navigate('disc-type')
	const goToBrandScreen = () => navigation.navigate('disc-brand')
	const goToConditionScreen = () => navigation.navigate('disc-condition')
	const goToColorScreen = () => navigation.navigate('disc-color')

	const CONTAINER: ViewStyle = { marginTop: 15 }
	const DESCRIPTION: TextStyle = { fontWeight: '500', marginBottom: 15 }

	return (
		<View style={CONTAINER}>
			<Text style={DESCRIPTION}>Details</Text>
			<SelectorButton onPress={goToTypeScreen} value={type.value} label="Type" />
			<SelectorButton onPress={goToBrandScreen} value={brand.value} label="Brand" />
			<SelectorButton onPress={goToConditionScreen} value={condition.value} label="Condition" />
			<SelectorButton onPress={goToColorScreen} value={color.value} label="Color" last />
		</View>
	)
}

interface SelectorButtonProps {
	onPress(): void
	value: string | number
	label: string
	last?: boolean
}

function SelectorButton({ onPress, value, label, last }: SelectorButtonProps) {
	const SELECTOR_CONTAINER: ViewStyle = { backgroundColor: '#fff', marginHorizontal: -16, borderBottomWidth: 0.75, borderColor: '#d1d5db' }
	const SELECTOR: ViewStyle = {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16
	}
	const SELECTOR_TEXT_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' }
	const SELECTOR_TEXT_LABEL: TextStyle = { width: 85, color: '#374151' }
	const SELECTOR_VALUE: TextStyle = { color: '#2563EB' }
	const SELECTOR_VALUE_PLACEHOLDER: TextStyle = { color: 'gray', fontSize: 13, fontWeight: '300' }
	const NO_BORDER: ViewStyle = { borderBottomWidth: 0 }

	return (
		<Pressable onPress={onPress} style={last ? [SELECTOR_CONTAINER, NO_BORDER] : SELECTOR_CONTAINER}>
			<View style={SELECTOR}>
				<View style={SELECTOR_TEXT_CONTAINER}>
					<Text style={SELECTOR_TEXT_LABEL}>{label}</Text>
					{value ? <Text style={SELECTOR_VALUE}>{value}</Text> : <Text style={SELECTOR_VALUE_PLACEHOLDER}>Select {label.toLowerCase()}</Text>}
				</View>
				<View>
					<ChevronRightIcon size={18} />
				</View>
			</View>
		</Pressable>
	)
}
