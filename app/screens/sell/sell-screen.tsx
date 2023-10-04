/* eslint-disable react/display-name */
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useHookstate } from '@hookstate/core'
import { StackScreenProps } from '@react-navigation/stack'
import { ApiResponse } from 'apisauce'
import { observer } from 'mobx-react-lite'
import React, { FC, useCallback, useContext, useMemo, useRef } from 'react'
import { View, Text, Pressable, ScrollView, Alert } from 'react-native'
import { Button, Header, Screen } from '../../components'
import ListingSuccessModal from '../../components/modals/listing-success-modal'
import LoadingOverlay from '../../components/modals/loading-overlay'
import ProfileSetupModal from '../../components/modals/profile-setup-modal'
import Description from '../../components/sell/DescriptionSelection'
import Details from '../../components/sell/DetailsSelection'
import Images from '../../components/sell/ImageSelection'
import Price from '../../components/sell/PriceSelection'
import Shipping from '../../components/sell/ShippingSelection'
import { ProfileContext } from '../../context/Profile'
import { SellStackParamsList } from '../../navigators/stacks/Sell'
import { api } from '../../services/api'
import { clearStore, sellStore } from '../../state/sell-state'
import addNewListing from '../../utils/supabase/addNewListing'
import validateStore from '../../utils/sell/validate'
import useAuth from '../../hooks/useAuth'
const API_BASE_URL = 'http://172.30.0.177:3000/api'

export const SellScreen: FC<StackScreenProps<SellStackParamsList, 'sell-screen'>> = observer(({ navigation }) => {
	const goBack = () => {
		clearStore()
		navigation.goBack()
	}

	const { session } = useAuth()
	const { profile } = useContext(ProfileContext)
	const store = useHookstate(sellStore)
	const [loading, setLoading] = React.useState(false)
	const [modalComponent, setModalComponent] = React.useState<'processing-fee' | 'platform-fee'>('processing-fee')
	const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
	const [isProfileSetupModalOpen, setIsProfileSetupModalOpen] = React.useState(!profile?.setup_complete)

	const handleModalOpen = () => setIsSuccessModalOpen(true)
	const handleModalClose = () => setIsSuccessModalOpen(false)

	async function handlePost() {
		try {
			const errors = validateStore(store.value)
			if (errors) {
				setLoading(false)
			} else {
				setLoading(true)

				// Upload images to Cloudinary and get back the URLs
				const { data: imageUrls }: ApiResponse<string[]> = await api.apisauce.post(`${API_BASE_URL}/cloudinary/upload`, {
					images: store.images.value,
					user_id: session.user.id
				})

				// Add the post to the database
				await addNewListing(store.value, session.user.id, imageUrls)

				clearStore()
				handleModalOpen()
			}
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null)

	// variables
	const snapPoints = useMemo(() => ['30%'], [])

	// callbacks
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present()
	}, [])
	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index)
	}, [])

	function handleOpenModal(component: 'platform-fee' | 'processing-fee') {
		setModalComponent(component)
		handlePresentModalPress()
	}

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="Sell an item" leftIcon="back" onLeftPress={goBack} rightText="List" onRightPress={handlePost} />
				<ScrollView className="px-4 pt-4 pb-10 bg-gray-100">
					<Images />
					<Description />
					<Details navigation={navigation} />
					<Shipping />
					<Price openModal={handleOpenModal} />
					<View className="mt-8 pb-10">
						<Button onPress={handlePost} text="List" />
					</View>
				</ScrollView>
				<ListingSuccessModal isModalOpen={isSuccessModalOpen} handleModalClose={handleModalClose} />
				<ProfileSetupModal navigation={navigation} isModalOpen={isProfileSetupModalOpen} handleModalClose={() => setIsProfileSetupModalOpen(false)} />
			</Screen>
			<BottomSheetModalProvider>
				<BottomSheetModal
					style={{
						shadowColor: '#000',
						shadowOffset: {
							width: 0,
							height: 8
						},
						shadowOpacity: 0.44,
						shadowRadius: 10.32,
						elevation: 16
					}}
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={snapPoints}
					onChange={handleSheetChanges}
				>
					<View className="px-6">
						<Text className="text-center text-lg text-gray-700 font-semibold mb-2">{modalComponent === 'platform-fee' ? 'Platform Fee' : 'Processing fee'}</Text>
						<Text className="text-center text-gray-700 font-light mb-6">
							{modalComponent === 'platform-fee'
								? '5% of the sale price. This helps us cover the operating costs for the platform; servers, databases etc.'
								: '2.9% of the sale price + $0.30. This is the fee of our payment processing partner, Stripe.'}
						</Text>
						<Pressable onPress={() => bottomSheetModalRef.current?.dismiss()} className="bg-gray-200 px-4 py-2">
							<Text className="text-gray-700 font-semibold text-base text-center">Close</Text>
						</Pressable>
					</View>
				</BottomSheetModal>
			</BottomSheetModalProvider>
			<LoadingOverlay show={loading} />
		</View>
	)
})
