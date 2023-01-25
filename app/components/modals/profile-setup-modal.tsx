import React from 'react'
import { Modal, Pressable, Text, View, Image } from 'react-native'
import { Button } from '..'
import { screenWidth } from '../../utils/screen-dimensions'
import { ModalProps } from './modal.props'
const stripe = require('../../../assets/images/stripe.png')

export default function ProfileSetupModal(props: ModalProps) {
	const { isModalOpen, handleModalClose, navigation } = props

	const handleGoToAccount = () => {
		handleModalClose()
		navigation.navigate('account')
	}
	const handleDismiss = () => {
		handleModalClose()
		navigation.navigate('home')
	}

	return (
		<Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={handleModalClose}>
			<View className="bg-black/50 absolute w-full h-full">
				<View className="flex-1 justify-center items-center">
					<View className="bg-white w-full rounded-md overflow-hidden" style={{ width: screenWidth - 60 }}>
						<View className="p-5">
							<View className="items-center mb-2">
								<Image className="h-40 w-40" resizeMode="contain" source={stripe} />
							</View>
							<Text className="text-2xl mb-3">Your account is not complete</Text>
							<Text className="mb-5">In order to list items for sale on Hyzer Flip, you need to complete your merchant account set up with our partner Sripe.</Text>
							<View className="mb-3">
								<Button preset="filled" onPress={handleGoToAccount} text="Finish setup" />
							</View>
							<Pressable onPress={handleDismiss}>
								<Text className="text-center text-gray-400">Dismiss</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	)
}
