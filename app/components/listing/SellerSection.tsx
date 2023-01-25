import { StackNavigationProp } from '@react-navigation/stack'
import React, { useContext } from 'react'
import { ActivityIndicator, Image, ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button } from '..'
import { ProfileContext } from '../../context/Profile'
import useProfile from '../../hooks/useProfile'
import { Listing } from '../../../types'
import ProfileStars from './ProfileStars'
import { SaleWithListing } from '../../hooks/usePurchase'

interface Props {
	listing?: Listing
	sale?: SaleWithListing
	navigation: StackNavigationProp<any>
}

export default function SellerInformationSection({ navigation, listing, sale }: Props) {
	const { profile } = useContext(ProfileContext)
	const { profile: sellerProfile, sales: sellerSales, reviews: sellerReviews, error: sellerProfileError } = useProfile(listing?.user_id || sale?.buyer_id)

	const goToMessageItemSeller = () => navigation.navigate('message-screen', { user2: sellerProfile.id, listingId: listing?.id || sale.listing_id })
	const goToProfile = () => navigation.navigate('profile-screen', { id: sellerProfile.id })

	const CONTAINER: ViewStyle = { backgroundColor: '#fff', paddingHorizontal: 16, marginTop: 10 }
	const SECTION: ViewStyle = { display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }
	const SECTION_TITLE: TextStyle = { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 20, color: '#374151' }
	const VIEW_PROFILE: TextStyle = { color: '#2563EB', fontWeight: '500' }
	const PROFILE_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }
	const INFO_CONTAINER: ViewStyle = { marginLeft: 10 }
	const USERNAME: TextStyle = { color: '#374151', fontWeight: '500', fontSize: 16 }
	const SALES: TextStyle = { color: 'gray', fontSize: 10 }
	const WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
	const MESSAGE_BUTTON: ViewStyle = { borderWidth: 1, borderColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8 }
	const MESSAGE_BUTTON_TEXT: TextStyle = { color: '#2563EB', fontWeight: '500', fontSize: 14 }

	if (!sellerProfile) return <ActivityIndicator />

	if (sellerProfileError)
		return (
			<View style={CONTAINER}>
				<Text style={SECTION_TITLE}>{sellerProfileError}</Text>
			</View>
		)

	return (
		<View style={CONTAINER}>
			<View style={SECTION}>
				<Text style={SECTION_TITLE}>{listing ? 'Seller' : 'Buyer'} information</Text>
				<Button onPress={goToProfile} textStyle={VIEW_PROFILE} preset="default" text="View profile" />
			</View>
			<View style={WRAPPER}>
				<View style={PROFILE_CONTAINER}>
					<View>
						<Image className="h-10 w-10 rounded-full" source={{ uri: sellerProfile.image_url, cache: 'force-cache' }} />
					</View>
					<View style={INFO_CONTAINER}>
						<Text style={USERNAME}>{sellerProfile.username}</Text>
						<ProfileStars reviews={sellerReviews} />
						<Text style={SALES}>{sellerSales.length} completed sales</Text>
					</View>
				</View>
				{profile?.id !== (listing?.user_id || sale?.buyer_id) && (
					<View>
						<Button onPress={goToMessageItemSeller} style={MESSAGE_BUTTON} textStyle={MESSAGE_BUTTON_TEXT} preset="default" text="Message" />
					</View>
				)}
			</View>
		</View>
	)
}
