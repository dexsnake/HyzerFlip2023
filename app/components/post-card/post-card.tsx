import { NavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { format } from 'date-fns'
import React from 'react'
import { Image, ImageStyle, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Listing } from '../../../types'
import { colors, spacing } from '../../theme'
import { Button } from '../Button'
import { twMerge } from 'tailwind-merge'
import { EyeIcon, HeartIcon } from 'react-native-heroicons/outline'

interface Props {
	item: Listing
	navigation: StackNavigationProp<any> | NavigationProp<any>
	active?: boolean
	sold?: boolean
	cols: 1 | 2 | 3
}

export default function PostCard({ item, navigation, active, sold, cols }: Props) {
	const [wrapperWidth, setWrapperWidth] = React.useState(0)
	const goToSellScreen = () => navigation.navigate('edit-listing', { listing: item })

	function determineWrapperWidth() {
		if (cols === 1) return '100%'
		if (cols === 2) return '50%'
		if (cols === 3) return '33.33%'
		else return '100%'
	}

	const WRAPPER: ViewStyle = {
		width: determineWrapperWidth(),
		height: wrapperWidth,
		marginBottom: 15,
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
	const PRICE: TextStyle = { fontSize: 16, fontWeight: '500', color: '#ffffff' }
	const LEFT: ViewStyle = { left: 5, backgroundColor: 'rgba(0,0,0,0.45)' }
	const FREE_SHIPPING: TextStyle = { color: '#ffffff', fontWeight: '500', fontSize: 10 }
	const RIGHT: ViewStyle = { right: 5, backgroundColor: 'rgba(37, 99, 235, 0.8)' }
	const SOLD_CONTAINER: ViewStyle = { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(251, 146, 60, 0.8)', paddingHorizontal: 8, paddingVertical: 4 }
	const SOLD_TEXT: TextStyle = { color: '#fff', fontSize: 12, fontWeight: '600' }
	const INACTIVE_CONTAINER: ViewStyle = {
		position: 'absolute',
		top: '50%',
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		marginTop: -10,
		width: '100%'
	}
	const INACTIVE_TEXT: TextStyle = { color: '#fff', fontSize: 15, fontWeight: '600', textAlign: 'center' }

	return (
		<View style={WRAPPER}>
			<Pressable onPress={() => navigation.navigate('listing-screen', { id: item.id })} onLayout={(e) => setWrapperWidth(e.nativeEvent.layout.width)}>
				<View style={CONTAINER}>
					<Image source={{ uri: item.images[0], cache: 'force-cache' }} style={[IMAGE, { opacity: item.status === 'inactive' ? 0.5 : 1 }]} />
					<View style={[DETAIL_WRAPPER, LEFT]}>
						<Text style={PRICE}>${item.price}</Text>
					</View>

					{item.free_shipping && !item.sold_at && (
						<View
							className={twMerge('flex-row items-center absolute rounded-md justify-center py-1 px-[6px] right-1 bg-flip-100/80', cols === 3 ? 'top-1' : 'bottom-1')}
						>
							<Text style={FREE_SHIPPING}>Free shipping</Text>
						</View>
					)}
					{item.status === 'sold' ? (
						<View style={SOLD_CONTAINER}>
							<Text style={SOLD_TEXT}>SOLD</Text>
						</View>
					) : null}
					{item.status === 'inactive' ? (
						<View style={INACTIVE_CONTAINER}>
							<Text style={INACTIVE_TEXT}>Inactive</Text>
						</View>
					) : null}
				</View>
			</Pressable>
			{active && (
				<View style={{ marginTop: 10 }}>
					<Text numberOfLines={1} style={{ fontWeight: '500', marginBottom: 5 }}>
						{item.title}
					</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text style={{ fontSize: 12, color: 'gray' }}>{format(new Date(item.created_at), 'MM/dd/yyyy')}</Text>
						<View style={{ flexDirection: 'row' }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<HeartIcon size={18} />
								<Text style={{ fontSize: 12, marginLeft: 3, color: 'gray' }}>{item.likes}</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
								<EyeIcon size={18} />
								<Text style={{ fontSize: 12, marginLeft: 3, color: 'gray' }}>{item.views}</Text>
							</View>
						</View>
					</View>
					<View style={{ marginTop: 8 }}>
						<Button
							onPress={goToSellScreen}
							text="Edit"
							textStyle={{ fontSize: 12, fontWeight: '500' }}
							style={{ paddingVertical: 6, paddingHorizontal: 8, maxWidth: 75 }}
						/>
					</View>
				</View>
			)}
			{sold && (
				<View style={{ marginTop: 10 }}>
					<View style={{ marginTop: 8 }}>
						<Button text="Add tracking" textStyle={{ fontSize: 12, fontWeight: '500' }} style={{ paddingVertical: 6, paddingHorizontal: 8 }} />
					</View>
				</View>
			)}
		</View>
	)
}
