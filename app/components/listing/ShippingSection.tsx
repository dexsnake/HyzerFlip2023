import React from 'react'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { Listing } from '../../../types'

import getStateFromZip from '../../utils/getStateFromZipcode'

interface Props {
	item: Listing
}

export default function ShippingSection({ item }: Props) {
	const CONTAINER: ViewStyle = { backgroundColor: '#fff', paddingHorizontal: 16, marginTop: 10 }
	const SECTION_TITLE: TextStyle = { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 20, color: '#374151' }
	const DETAIL_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: 15 }
	const DETAIL_NAME: TextStyle = { color: 'gray', width: 90 }
	const DETAIL_TEXT: TextStyle = { color: '#2563EB', width: 220 }

	return (
		<View style={CONTAINER}>
			<View>
				<Text style={SECTION_TITLE}>Shipping</Text>
				<View style={DETAIL_CONTAINER}>
					<Text style={DETAIL_NAME}>Shipping</Text>
					<Text style={DETAIL_TEXT}>{item.free_shipping ? 'Free' : `$${item.shipping_cost}`}</Text>
				</View>
				<View style={DETAIL_CONTAINER}>
					<Text style={DETAIL_NAME}>Ships from</Text>
					<Text style={DETAIL_TEXT}>{getStateFromZip(item.ships_from).name}</Text>
				</View>
			</View>
		</View>
	)
}
