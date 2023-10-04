import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect, useState } from 'react'
import { View, Text, Image, TextInput, Alert } from 'react-native'
import { Button, Header, Screen } from '../../../components'
import { delay } from '../../../utils/delay'
import LoadingOverlay from '../../../components/modals/loading-overlay'
import { AccountStackParamsList } from '../../../navigators/stacks/Account'
import { supabase } from '../../../clients/supabase'
import { getTracking, TrackingNumber } from 'ts-tracking-number'
import { CheckCircleIcon, XCircleIcon } from 'react-native-heroicons/solid'
import { api } from '../../../services/api'

const shippingBox = require('../../../../assets/images/shipping-box.png')

export const AddTrackingScreen: FC<StackScreenProps<AccountStackParamsList, 'add-tracking-screen'>> = ({ navigation, route }) => {
	const goBack = () => navigation.goBack()
	const [trackingNumber, setTrackingNumber] = useState('')
	const [trackingValid, setTrackingValid] = useState<TrackingNumber | undefined>(undefined)
	const [loading, setLoading] = useState(false)

	async function updateTracking() {
		try {
			setLoading(true)
			const { error } = await supabase
				.from('sales')
				.update({ tracking_number: trackingNumber, status: 'shipped', shipped_at: new Date().toISOString(), updated_at: new Date().toISOString() })
				.eq('id', route.params.saleId)
			if (error) throw new Error(error.message)
			api.apisauce.post('/notifications/item-shipped', { saleId: route.params.saleId })
			await delay(2000)
			goBack()
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (!trackingNumber) setTrackingValid(undefined)
		if (trackingNumber) {
			const tracking = getTracking(trackingNumber)
			setTrackingValid(tracking)
		}
	}, [trackingNumber])

	return (
		<View className="flex-1">
			<Screen keyboardShouldPersistTaps="always" backgroundColor="#fff">
				<Header leftIcon="close" border={false} onLeftPress={goBack} />
				<View className="items-center px-4">
					<View className="items-center mb-2">
						<Image className="h-40 w-40" resizeMode="contain" source={shippingBox} />
					</View>
					<View className="mb-4">
						<Text className="text-2xl mb-2 text-center font-medium text-gray-800">Confirm Shipment</Text>
						<Text className="text-center text-gray-700 font-light">Select a carrier and adding a tracking number</Text>
					</View>

					<View className="w-72 relative">
						<TextInput
							placeholder="Tracking number"
							value={trackingNumber}
							onChangeText={setTrackingNumber}
							clearButtonMode="while-editing"
							className=" border-gray-300 border-line h-12 px-2 rounded text-base mb-4"
						/>
						{trackingValid && (
							<View className="absolute -right-8 top-3">
								<CheckCircleIcon color="#22c55e" />
							</View>
						)}
						{trackingNumber && !trackingValid && (
							<View className="absolute -right-8 top-3">
								<XCircleIcon color="#ef4444" />
							</View>
						)}
						<Button disabled={!trackingValid} preset="filled" onPress={updateTracking} text="Confirm shipment" />
					</View>
				</View>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
}
