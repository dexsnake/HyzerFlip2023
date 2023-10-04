import { useHookstate } from '@hookstate/core'
import React from 'react'
import { Text, TextInput, TextStyle, View, ViewStyle } from 'react-native'
import { sellStore } from '../../state/sell-state'

export default function DescriptionSelection() {
	const { title, description } = useHookstate(sellStore)

	const CONTAINER: ViewStyle = { marginTop: 15 }
	const DESCRIPTION: TextStyle = { fontWeight: '500', marginBottom: 15 }
	const INPUT_CONTAINER: ViewStyle = { backgroundColor: '#fff', marginHorizontal: -16 }
	const INPUT: TextStyle = {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderBottomWidth: 0.75,
		borderBottomColor: '#d1d5db',
		color: '#374151'
	}
	const LAST_INPUT: TextStyle = { borderBottomWidth: 0 }
	const TEXT_AREA: ViewStyle = { height: 80, marginTop: 16 }
	return (
		<View style={CONTAINER}>
			<Text style={DESCRIPTION}>Description</Text>
			<View style={INPUT_CONTAINER}>
				<TextInput value={title.value} style={INPUT} placeholder="What are you selling?" placeholderTextColor="#d1d5db" onChangeText={(text) => title.set(text)} />
				<TextInput
					value={description.value}
					multiline
					numberOfLines={20}
					style={[INPUT, TEXT_AREA]}
					placeholder="Describe your item (5+ words)"
					placeholderTextColor="#d1d5db"
					onChangeText={(text) => description.set(text)}
				/>
			</View>
		</View>
	)
}
