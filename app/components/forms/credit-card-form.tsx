import { StackNavigationProp } from '@react-navigation/stack'
import React, { useContext, useState, useEffect } from 'react'
import { Alert, View, ViewStyle } from 'react-native'
import { useStripe } from '@stripe/stripe-react-native'
import axios from 'axios'
import { ProfileContext } from '../../context/Profile'
import { Button } from '..'
import { SettingsStackParamsList } from '../../navigators/stacks/Settings'
const API_BASE_URL = 'http://172.30.0.177:3000/api'
interface Props {
	navigation: StackNavigationProp<SettingsStackParamsList>
}

export default function CreditCardForm({ navigation }: Props) {
	const WRAPPER: ViewStyle = { marginTop: 20 }

	const { profile } = useContext(ProfileContext)
	const { initPaymentSheet, presentPaymentSheet } = useStripe()

	const [loading, setLoading] = useState(false)

	const fetchPaymentSheetParams = async () => {
		const { data } = await axios.post(`${API_BASE_URL}/stripe/payment-sheet`, {
			customer_id: profile.customer_id
		})
		const { setupIntent, ephemeralKey } = data

		return {
			setupIntent,
			ephemeralKey
		}
	}

	const initializePaymentSheet = async () => {
		const { setupIntent, ephemeralKey } = await fetchPaymentSheetParams()

		const { error } = await initPaymentSheet({
			customerId: profile.customer_id,
			customerEphemeralKeySecret: ephemeralKey,
			setupIntentClientSecret: setupIntent,
			merchantDisplayName: 'Hyzer Flip'
		})
		if (!error) {
			setLoading(true)
		}
	}

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet()
		if (error) {
			Alert.alert(`Error code: ${error.code}`, error.message)
		} else {
			Alert.alert('Success', 'Your payment method is successfully set up for future payments!')
		}
	}

	useEffect(() => {
		initializePaymentSheet().then(() => openPaymentSheet())
	}, [])

	return (
		<View style={WRAPPER}>
			<Button onPress={openPaymentSheet} text="Set up" />
		</View>
	)
}
