/* eslint-disable react/display-name */
import { useState } from '@hookstate/core'
import { StackScreenProps } from '@react-navigation/stack'
import { ApiResponse } from 'apisauce'
import React, { FC, useEffect } from 'react'
import { ActivityIndicator, TextStyle, View, ViewStyle, Text, Alert } from 'react-native'
import { Button, Header, Screen } from '../../components'
import Description from '../../components/sell/DescriptionSelection'
import Details from '../../components/sell/DetailsSelection'
import Images from '../../components/sell/ImageSelection'
import Price from '../../components/sell/PriceSelection'
import Shipping from '../../components/sell/ShippingSelection'
import { EditListingStackParamsList } from '../../navigators/stacks/EditListing'
import { api } from '../../services/api'
import { clearStore, initStore, sellStore } from '../../state/sell-state'
import { colors, spacing } from '../../theme'
import { updateListing } from '../../utils/supabase/updateListing'
import validateStore from '../../utils/sell/validate'
const API_BASE_URL = 'http://172.30.0.177:3000/api'

export const EditListingScreen: FC<StackScreenProps<EditListingStackParamsList, 'edit-listing-screen'>> = ({ navigation, route }) => {
	const goBack = () => {
		Alert.alert('', 'Do you want to discard changes?', [
			{ text: 'Cancel' },
			{
				text: 'Discard',
				onPress: () => {
					clearStore()
					navigation.goBack()
				},
				style: 'destructive'
			}
		])
	}

	const store = useState(sellStore)
	const [loading, setLoading] = React.useState(false)

	useEffect(() => {
		if (route.params.listing) {
			initStore(route.params.listing)
		}
	}, [])

	const FULL: ViewStyle = { flex: 1 }
	const CONTAINER: ViewStyle = { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }

	const HEADER: TextStyle = {
		paddingTop: 28,
		paddingBottom: 16,
		paddingHorizontal: 16,
		backgroundColor: '#fff'
	}
	const HEADER_TITLE: TextStyle = {
		color: '#1f2937',
		fontWeight: '500',
		textAlign: 'center',
		letterSpacing: 1.2
	}

	const LIST_BUTTON_CONTAINER: ViewStyle = { marginTop: 20 }
	const LIST_BUTTON_TEXT: TextStyle = { color: '#fff', fontWeight: '500', letterSpacing: 1 }

	async function handleUpdate() {
		try {
			const errors = validateStore(store.value)
			if (errors) {
				setLoading(false)
			} else {
				setLoading(true)

				const storeCopy = { ...store.value }

				if (storeCopy.newImages.length > 0) {
					// Upload images to Cloudinary and get back the URLs
					const imageUrls: ApiResponse<string[]> = await api.apisauce.post(`${API_BASE_URL}/cloudinary/upload`, { images: storeCopy.newImages, listingId: storeCopy.id })

					delete storeCopy.editMode
					delete storeCopy.newImages

					const allImages = [...storeCopy.images, ...imageUrls.data]

					// Update listing in database with new images
					await updateListing(storeCopy.id, {
						...storeCopy,
						images: allImages,
						price: parseInt(storeCopy.price),
						shipping_cost: storeCopy.free_shipping ? 0 : parseInt(storeCopy.shipping_cost),
						updated_at: new Date().toISOString()
					})
				} else {
					delete storeCopy.editMode
					delete storeCopy.newImages

					// Update listing in database
					await updateListing(storeCopy.id, {
						...storeCopy,
						price: parseInt(storeCopy.price),
						shipping_cost: storeCopy.free_shipping ? 0 : parseInt(storeCopy.shipping_cost),
						updated_at: new Date().toISOString()
					})
				}

				setLoading(false)
				clearStore()
				navigation.goBack()
			}
		} catch (error) {
			setLoading(false)
			console.log(error)
		}
	}

	async function handleDeactivate() {
		Alert.alert('', 'Are you sure you want to deactivate this listing?', [
			{ text: 'Cancel' },
			{
				text: 'Deactivate',
				onPress: () => {
					updateListing(store.value.id, {
						status: 'inactive',
						updated_at: new Date().toISOString()
					})
					clearStore()
					navigation.goBack()
				},
				style: 'destructive'
			}
		])
	}

	async function handleActivate() {
		Alert.alert('', 'Are you sure you want to activate this listing?', [
			{ text: 'Cancel' },
			{
				text: 'Activate',
				onPress: () => {
					updateListing(store.value.id, {
						status: 'active',
						updated_at: new Date().toISOString()
					})
					clearStore()
					navigation.goBack()
				},
				style: 'default'
			}
		])
	}

	function handleDelete() {
		Alert.alert('', 'Are you sure you want to delete this listing?', [
			{ text: 'Cancel' },
			{
				text: 'Delete',
				onPress: () => {
					updateListing(store.value.id, {
						status: 'deleted',
						updated_at: new Date().toISOString()
					})
					clearStore()
					navigation.goBack()
				},
				style: 'destructive'
			}
		])
	}

	return (
		<View style={FULL}>
			<Screen preset="scroll" backgroundColor="#fff">
				<Header title="Edit item" leftIcon="caretLeft" onLeftPress={goBack} rightText="Update" onRightPress={handleUpdate} />
				<View className="px-4 pt-4 pb-10 bg-gray-100">
					<Images />
					<Description />
					<Details navigation={navigation} />
					<Shipping />
					{/* @ts-ignore */}
					<Price />
					<View style={LIST_BUTTON_CONTAINER}>
						<Button onPress={handleUpdate} preset="default">
							{loading ? <ActivityIndicator color="#fff" /> : <Text style={LIST_BUTTON_TEXT}>Update</Text>}
						</Button>
					</View>
					<View style={{ borderBottomColor: '#374151', borderBottomWidth: 0.75, marginTop: 12 }} />
					<View style={{ marginTop: -10, alignItems: 'center' }}>
						<Text style={{ backgroundColor: '#F2F2F2', width: 80, textAlign: 'center' }}>or</Text>
					</View>
					{store.status.value === 'active' && (
						<View style={{ marginTop: 12 }}>
							<Button onPress={handleDeactivate} preset="reversed" text="Deactivate" />
						</View>
					)}
					{store.status.value === 'inactive' && (
						<View style={{ marginTop: 12 }}>
							<Button onPress={handleActivate} preset="reversed" text="Activate" />
						</View>
					)}
					<View style={{ marginTop: 12 }}>
						<Button onPress={handleDelete} preset="reversed" text="Delete" />
					</View>
				</View>
			</Screen>
		</View>
	)
}
