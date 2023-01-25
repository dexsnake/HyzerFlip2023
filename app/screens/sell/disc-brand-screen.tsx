import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle, Text, Pressable } from 'react-native'
import { Header, Screen } from '../../components'
import { SellStackParamsList } from '../../navigators/stacks/Sell'
import { colors, spacing } from '../../theme'
import DiscBrands from '../../constants/DiscBrands'
import { useState } from '@hookstate/core'
import { sellStore } from '../../state/sell-state'
import { ScrollView } from 'react-native-gesture-handler'
import { CheckIcon } from 'react-native-heroicons/outline'

export const DiscBrandScreen: FC<StackScreenProps<SellStackParamsList, 'disc-brand'>> = observer(({ navigation }) => {
	const { brand } = useState(sellStore)

	const goBack = () => navigation.goBack()

	const SELECTION_CONTAINER: ViewStyle = {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 0.75,
		borderBottomColor: '#374151',
		paddingHorizontal: 16,
		paddingVertical: 16
	}
	const SELECTION_TEXT: TextStyle = { color: '#1f2937' }
	const SELECTED: TextStyle = { color: '#2563EB' }

	function handleSetDiscBrand(brandName: string) {
		goBack()
		brand.set(brandName)
	}

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header leftIcon="back" title="Brand" onLeftPress={goBack} />
				<ScrollView>
					{DiscBrands.map((brandName) => {
						return (
							<Pressable onPress={() => handleSetDiscBrand(brandName)} key={brandName} style={SELECTION_CONTAINER}>
								<Text style={brand.value === brandName ? [SELECTION_TEXT, SELECTED] : SELECTION_TEXT}>{brandName}</Text>
								{brand.value === brandName && <CheckIcon size={20} />}
							</Pressable>
						)
					})}
				</ScrollView>
			</Screen>
		</View>
	)
})
