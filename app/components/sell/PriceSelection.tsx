import { useHookstate } from '@hookstate/core'
import React, { useRef } from 'react'
import { Pressable, Text, TextInput, TextStyle, View, ViewStyle, StyleSheet } from 'react-native'
import { QuestionMarkCircleIcon } from 'react-native-heroicons/outline'
import { sellStore } from '../../state/sell-state'
import { calculateEarn } from '../../utils/calculateEarn'
import { calculatePlatformFee } from '../../utils/calculatePlatformFee'
import { calculateProcessingFee } from '../../utils/calculateProcessingFee'
import formatPrice from '../../utils/formatPrice'

interface Props {
	openModal: (component: 'platform-fee' | 'processing-fee') => void
}

export default function PriceSelection({ openModal }: Props) {
	const { price, shipping_cost, free_shipping } = useHookstate(sellStore)

	const platformFee = calculatePlatformFee(price.value)
	const processingFee = calculateProcessingFee(price.value)

	const earn = calculateEarn(price.value, shipping_cost.value)

	const priceInput = useRef(null)

	const CONTAINER: ViewStyle = { marginTop: 15 }
	const DESCRIPTION: TextStyle = { fontWeight: '500', marginBottom: 15 }
	const INPUT_CONTAINER: ViewStyle = { backgroundColor: '#fff', marginHorizontal: -16, borderBottomWidth: 0.75, borderBottomColor: '#d1d5db' }
	const PRICE_INPUT_WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }
	const PRICE_INPUT_WRAPPER_CONTAINER: ViewStyle = { position: 'relative' }
	const PRICE_INPUT: TextStyle = { paddingVertical: 16, color: '#2563EB', fontSize: 16, fontWeight: '500' }
	const SHIPPING_DOLLAR_SIGN: TextStyle = { position: 'absolute', left: -10, top: 16, color: '#2563EB', fontSize: 16, fontWeight: '500' }
	const PRICE_LABEL: TextStyle = { color: '#374151' }
	const LINE_ITEM_CONTAINER: ViewStyle = { backgroundColor: '#fff', marginHorizontal: -16, paddingHorizontal: 16, paddingVertical: 16 }
	const LINE_ITEM: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }
	const MB_0: ViewStyle = { marginBottom: 0 }
	const LINE_ITEM_TEXT: TextStyle = { fontSize: 12, color: 'gray' }
	const DARK: TextStyle = { color: '#374151' }
	const BOLD: TextStyle = { fontWeight: '500' }

	return (
		<>
			<View style={CONTAINER}>
				<Text style={DESCRIPTION}>Price</Text>
				<View style={INPUT_CONTAINER}>
					<Pressable onPress={() => priceInput.current.focus()}>
						<View style={PRICE_INPUT_WRAPPER}>
							<Text style={PRICE_LABEL}>Set your price</Text>
							<View style={PRICE_INPUT_WRAPPER_CONTAINER}>
								<TextInput
									ref={priceInput}
									value={price.value}
									style={PRICE_INPUT}
									returnKeyType="done"
									maxLength={3}
									placeholder="$0"
									placeholderTextColor="#d1d5db"
									keyboardType="number-pad"
									onChangeText={(text) => price.set(text)}
								/>
								{price.value ? <Text style={SHIPPING_DOLLAR_SIGN}>$</Text> : null}
							</View>
						</View>
					</Pressable>
				</View>
				<View style={LINE_ITEM_CONTAINER}>
					{/* TODO: Add tooltips next to selling fee and processing fee */}
					{price.value ? (
						<>
							<View style={LINE_ITEM}>
								<View className="flex-row gap-1 items-center">
									<Text style={LINE_ITEM_TEXT}>Processing fee</Text>
									<Pressable onPress={() => openModal('processing-fee')}>
										<QuestionMarkCircleIcon size={16} color="#6b7280" />
									</Pressable>
								</View>
								<Text style={LINE_ITEM_TEXT}>-{formatPrice(processingFee)}</Text>
							</View>
							<View style={LINE_ITEM}>
								<View className="flex-row gap-1 items-center">
									<Text style={LINE_ITEM_TEXT}>Platform fee</Text>
									<Pressable onPress={() => openModal('platform-fee')}>
										<QuestionMarkCircleIcon size={16} color="#6b7280" />
									</Pressable>
								</View>
								<Text style={LINE_ITEM_TEXT}>-{formatPrice(platformFee)}</Text>
							</View>
							{!free_shipping.value && shipping_cost.value && (
								<View style={LINE_ITEM}>
									<Text style={LINE_ITEM_TEXT}>Shipping</Text>
									<Text style={LINE_ITEM_TEXT}>+{formatPrice(shipping_cost.value ? parseInt(shipping_cost.value) : 0)}</Text>
								</View>
							)}
						</>
					) : null}
					<View style={[LINE_ITEM, MB_0]}>
						<Text style={[LINE_ITEM_TEXT, BOLD, DARK]}>You earn</Text>
						<Text style={[LINE_ITEM_TEXT, BOLD, DARK]}>{formatPrice(earn)}</Text>
					</View>
				</View>
			</View>
		</>
	)
}
