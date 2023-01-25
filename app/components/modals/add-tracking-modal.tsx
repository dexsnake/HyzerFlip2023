import React, { useState } from 'react'
import { Modal, Pressable, Text, View, Image, Alert, ActivityIndicator } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../clients/supabase'
import { Button } from '../Button'
const shippingBox = require('../../../assets/images/shipping-box.png')

interface Props {
	isModalOpen: boolean
	handleModalClose: () => void
	saleId: number
}

export default function AddTrackingModal(props: Props) {
	const { isModalOpen, handleModalClose, saleId } = props
	const insets = useSafeAreaInsets()
	const [trackingNumber, setTrackingNumber] = useState('')
	const [carrier, setCarrier] = useState('')
	const [loading, setLoading] = useState(false)

	async function updateTracking() {
		try {
			setLoading(true)
			const { error } = await supabase.from('sales').update({ tracking_number: trackingNumber, shipping_carrier: carrier, status: 'shipped' }).eq('id', saleId)
			if (error) throw new Error(error.message)
			handleModalClose()
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal visible={isModalOpen} animationType="slide" onRequestClose={handleModalClose}>
			<View className="flex-1" style={{ paddingTop: insets.top }}>
				<View className="flex-row justify-end px-4">
					<Pressable onPress={handleModalClose}>
						<XMarkIcon color="#374151" size={30} />
					</Pressable>
				</View>
				<View className="flex-1 items-center px-4">
					<View className="items-center mb-2">
						<Image className="h-40 w-40" resizeMode="contain" source={shippingBox} />
					</View>
					<View className="mb-4">
						<Text className="text-2xl mb-2 text-center font-medium text-gray-800">Confirm Shipment</Text>
						<Text className="text-center text-gray-700 font-light">Select a carrier and adding a tracking number</Text>
					</View>
					<View className="w-full px-4">
						<TextInput placeholder="Carrier" value={carrier} onChangeText={setCarrier} className=" border-gray-300 border-line h-12 px-2 rounded text-base mb-4" />
						<TextInput
							placeholder="Tracking number"
							value={trackingNumber}
							onChangeText={setTrackingNumber}
							className=" border-gray-300 border-line h-12 px-2 rounded text-base mb-4"
						/>
						<Button className="w-full" preset="filled" onPress={updateTracking}>
							{loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Confirm shipment</Text>}
						</Button>
					</View>
				</View>
			</View>
		</Modal>
	)
}
