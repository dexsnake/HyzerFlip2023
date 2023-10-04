import React, { FC, useEffect } from 'react'
import { ActivityIndicator, View, ViewStyle, Text, Animated, StyleSheet, TextStyle, Pressable } from 'react-native'
import useListing from '../../hooks/useListing'
import { StackScreenProps } from '@react-navigation/stack'
import { ListingStackParamsList } from '../../navigators/stacks/Listing'
import ImageSlider from '../../components/listing/ImageSlider'
import DetailsSection from '../../components/listing/DetailsSection'
import { addListingView } from '../../utils/supabase/addListingView'
import OverviewSection from '../../components/listing/OverviewSection'
import SellerSection from '../../components/listing/SellerSection'
import ShippingSection from '../../components/listing/ShippingSection'
import { screenWidth } from '../../utils/screen-dimensions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import useAuth from '../../hooks/useAuth'

export const ListingScreen: FC<StackScreenProps<ListingStackParamsList, 'listing-screen'>> = ({ navigation, route }) => {
	const goBack = () => navigation.goBack()
	const focused = useIsFocused()
	const { session } = useAuth()
	const { listing, loading, error } = useListing(route.params.id, focused)
	const insets = useSafeAreaInsets()

	const yOffset = React.useRef(new Animated.Value(0)).current
	const headerOpacity = yOffset.interpolate({
		inputRange: [100, screenWidth],
		outputRange: [0, 1],
		extrapolate: 'clamp'
	})

	const scrollView = {
		onScroll: Animated.event(
			[
				{
					nativeEvent: {
						contentOffset: {
							y: yOffset
						}
					}
				}
			],
			{ useNativeDriver: true }
		)
	}

	useEffect(() => {
		function isReady() {
			if (!loading && listing) return true
			else return false
		}

		function notListingOwner() {
			if (listing.user_id !== session.user.id) return true
			else return false
		}

		if (isReady()) {
			if (session) {
				if (notListingOwner()) {
					addListingView(listing.id, session.user.id)
				}
			} else {
				addListingView(listing.id)
			}
		}
	}, [loading])

	const HEADER_WRAPPER: Animated.WithAnimatedObject<ViewStyle> = {
		backgroundColor: '#2563EB',
		...StyleSheet.absoluteFillObject,
		opacity: headerOpacity,
		zIndex: 9,
		height: insets.top <= 30 ? 65 : 100
	}
	const HEADER_CONTAINER: ViewStyle = {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		...StyleSheet.absoluteFillObject,
		zIndex: 10,
		height: 100,
		paddingTop: insets.top
	}
	const HEADER_TEXT_TITLE: Animated.WithAnimatedObject<TextStyle> = {
		opacity: headerOpacity,
		color: '#ffffff',
		textAlign: 'center',
		fontWeight: '600',
		marginBottom: 5,
		fontSize: 11
	}
	const HEADER_TEXT_PRICE: Animated.WithAnimatedObject<TextStyle> = { opacity: headerOpacity, color: '#ffffff', textAlign: 'center', fontSize: 16, fontWeight: '500' }

	if (loading) return <ActivityIndicator />
	if (error) return <Text className="text-red-500">{error}</Text>

	return (
		<View className="flex-1">
			<Animated.View style={HEADER_WRAPPER}></Animated.View>
			<Animated.View style={HEADER_CONTAINER}>
				<Animated.Text style={HEADER_TEXT_TITLE}>{listing.title}</Animated.Text>
				<Animated.Text style={HEADER_TEXT_PRICE}>${listing.price}</Animated.Text>
				<Pressable className={`absolute z-20 ${insets.top <= 30 ? 'top-[30px]' : 'top-[50px]'} left-[20px]`} onPress={goBack}>
					<ChevronLeftIcon size={26} color="#fff" />
				</Pressable>
			</Animated.View>
			<Animated.ScrollView onScroll={scrollView.onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
				<ImageSlider listing={listing} />
				<DetailsSection item={listing} />
				<OverviewSection item={listing} />
				<SellerSection navigation={navigation} listing={listing} />
				<ShippingSection item={listing} />
			</Animated.ScrollView>
		</View>
	)
}
