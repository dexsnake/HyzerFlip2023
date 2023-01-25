import React from 'react'
import { Modal, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button } from '..'
import { screenHeight } from '../../utils/screen-dimensions'
import { ModalProps } from './modal.props'
import { navigate } from '../../navigators'
import { XMarkIcon } from 'react-native-heroicons/outline'

export default function ListingSuccessModal(props: ModalProps) {
	const { isModalOpen, handleModalClose } = props

	const handleClose = () => {
		handleModalClose()
		navigate('home')
	}

	const OVERLAY: ViewStyle = { backgroundColor: '#fff', position: 'absolute', width: '100%', height: screenHeight }
	const CONTAINER: ViewStyle = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }
	const SUCCESS: TextStyle = { fontSize: 24, fontWeight: '600', color: '#374151', marginBottom: 4, textAlign: 'center' }
	const LISTING_LIVE: TextStyle = { color: '#374151', textAlign: 'center', marginBottom: 20 }
	return (
		<Modal visible={isModalOpen} transparent animationType="slide" onRequestClose={handleModalClose}>
			<View style={OVERLAY}>
				<Pressable onPress={handleClose}>
					<XMarkIcon size={30} />
				</Pressable>
				<View style={CONTAINER}>
					<Text style={SUCCESS}>Success 🎉</Text>
					<Text style={LISTING_LIVE}>Your listing is live</Text>
					<Button text="List another item" onPress={handleModalClose} />
				</View>
			</View>
		</Modal>
	)
}
