import React, { useEffect } from 'react'
import { Modal, Animated, View, ViewStyle, Easing } from 'react-native'
import { screenHeight } from '../../utils/screen-dimensions'
const loadingIcon = require('../../../assets/images/spinner-black.png')

interface Props {
	show: boolean
}

export default function LoadingOverlay({ show }: Props) {
	const spinValue = new Animated.Value(0)

	const spin = () => {
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 800,
				easing: Easing.linear,
				useNativeDriver: true
			})
		).start()
	}
	useEffect(() => {
		spin()
	}, [show])

	const rotate = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	})

	return (
		<Modal visible={show} transparent animationType="fade">
			<View className="absolute w-full" style={{ height: screenHeight }}>
				<View className="flex-1 justify-center items-center">
					<View className="bg-flip-502 p-4 rounded-lg">
						<Animated.Image style={{ transform: [{ rotate }] }} className="h-10 w-10 animate-none" resizeMode="contain" source={loadingIcon} />
					</View>
				</View>
			</View>
		</Modal>
	)
}
