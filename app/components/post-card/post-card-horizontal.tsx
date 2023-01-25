import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Image, ImageStyle, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { HomeStackParamsList } from '../../navigators/stacks/Home'
import { Listing } from '../../../types'

interface Props {
	item: Listing
	navigation: StackNavigationProp<HomeStackParamsList>
}

export default function PostCardHorizontal({ item, navigation }: Props) {
	const WRAPPER: ViewStyle = {
		width: 150,
		height: 150,
		padding: 5,
		position: 'relative'
	}
	const CONTAINER: ViewStyle = {
		height: '100%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	}
	const IMAGE: ImageStyle = {
		height: '100%',
		width: '100%',
		borderRadius: 6
	}
	const DETAIL_WRAPPER: ViewStyle = {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
		borderRadius: 6,
		justifyContent: 'center',
		paddingVertical: 4,
		paddingHorizontal: 6,
		bottom: 5
	}
	const PRICE: TextStyle = { fontSize: 12, fontWeight: '500', color: '#ffffff' }
	const LEFT: ViewStyle = { left: 5, backgroundColor: 'rgba(0,0,0,0.45)' }
	const FREE_SHIPPING: TextStyle = { color: '#ffffff', fontWeight: '500', fontSize: 10 }
	const RIGHT: ViewStyle = { right: 5, backgroundColor: 'rgba(37, 99, 235, 0.8)' }
	const SOLD_CONTAINER: ViewStyle = { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(251, 146, 60, 0.8)', paddingHorizontal: 8, paddingVertical: 4 }
	const SOLD_TEXT: TextStyle = { color: '#fff', fontSize: 12, fontWeight: '600' }

	return (
		<Pressable onPress={() => navigation.navigate('listing', { id: item.id })} style={WRAPPER}>
			<View style={CONTAINER}>
				<Image source={{ uri: item.images[0], cache: 'force-cache' }} style={IMAGE} />
				<View style={[DETAIL_WRAPPER, LEFT]}>
					<Text style={PRICE}>${item.price}</Text>
				</View>
				{item.free_shipping && !item.sold_at && (
					<View style={[DETAIL_WRAPPER, RIGHT]}>
						<Text style={FREE_SHIPPING}>Free shipping</Text>
					</View>
				)}
				{item.status === 'sold' && (
					<View style={SOLD_CONTAINER}>
						<Text style={SOLD_TEXT}>SOLD</Text>
					</View>
				)}
			</View>
		</Pressable>
	)
}
