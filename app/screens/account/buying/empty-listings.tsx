import React from 'react'
import { Text, View } from 'react-native'
import { Button } from '../../../components'
import { colors, spacing } from '../../../theme'

interface Props {
	page: string
}

export default function EmptyListings({ page }: Props) {
	return (
		<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
			<Text style={{ fontSize: 18, fontWeight: '500', color: '#1f2937', marginBottom: 16 }}>No {page} listings</Text>
			<Text style={{ fontSize: 14, color: 'gray', marginBottom: 8 }}>Selling on HyzerFlip is simple.</Text>
			<Text style={{ fontSize: 14, color: 'gray' }}>
				Here are tips for <Text style={{ textDecorationLine: 'underline' }}>how to sell an item</Text>
			</Text>
			<View style={{ borderBottomWidth: 0.75, borderBottomColor: '#374151', width: 100, marginVertical: 24 }} />
			<Button text="Sell now" />
		</View>
	)
}
