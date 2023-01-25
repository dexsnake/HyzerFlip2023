import { useState } from '@hookstate/core'
import { useNavigation } from '@react-navigation/native'
import { formatDistanceToNow } from 'date-fns'
import React, { useContext } from 'react'
import { Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button } from '..'
import { AuthContext } from '../../context/Auth'
import { navigate } from '../../navigators'
import { checkoutStore } from '../../state/checkout-state'
import { Listing } from '../../../types'
import Likes from './Likes'

interface Props {
	item: Listing
}

export default function DetailsSection({ item }: Props) {
	const { listing } = useState(checkoutStore)

	const { session } = useContext(AuthContext)

	function handleBuyNow() {
		listing.set(item)
		navigate('checkout')
	}

	const CONTAINER: ViewStyle = { backgroundColor: '#fff', padding: 16 }
	const WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }
	const TITLE: TextStyle = { fontSize: 20, fontWeight: '600', marginBottom: 5 }
	const CREATED_AT: TextStyle = { fontSize: 12, marginBottom: 10 }

	const PRICE_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' }
	const PRICE: TextStyle = { fontSize: 20, fontWeight: '600' }
	const SHIPPING: TextStyle = { fontSize: 12, marginLeft: 5 }
	const BUTTON_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }
	const BUTTON: ViewStyle = { width: '100%' }

	return (
		<View style={CONTAINER}>
			<View style={WRAPPER}>
				<View>
					<Text style={TITLE}>{item.title}</Text>
					<Text style={CREATED_AT}>Posted {formatDistanceToNow(new Date(item.created_at))} ago</Text>
					<View style={PRICE_CONTAINER}>
						<Text style={PRICE}>${item.price}</Text>
						{item.free_shipping ? <Text style={SHIPPING}>Free Shipping</Text> : <Text style={SHIPPING}>+${item.shipping_cost} shipping</Text>}
					</View>
				</View>
				<Likes item={item} />
			</View>
			{item.status === 'active' && session?.user.id !== item.user_id && (
				<View style={BUTTON_CONTAINER}>
					<Button onPress={handleBuyNow} text="Buy Now" style={{ width: '100%' }} />
				</View>
			)}
		</View>
	)
}
