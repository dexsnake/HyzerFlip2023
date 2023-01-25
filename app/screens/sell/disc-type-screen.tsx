import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle, Text, Pressable } from 'react-native'
import { Header, Screen } from '../../components'
import { SellStackParamsList } from '../../navigators/stacks/Sell'
import { colors, spacing } from '../../theme'
import DiscTypes from '../../constants/DiscTypes'
import { useState } from '@hookstate/core'
import { sellStore } from '../../state/sell-state'
import { ScrollView } from 'react-native-gesture-handler'
import { CheckIcon } from 'react-native-heroicons/outline'

export const DiscTypeScreen: FC<StackScreenProps<SellStackParamsList, 'disc-type'>> = observer(({ navigation }) => {
	const { type } = useState(sellStore)
	const goBack = () => navigation.goBack()
	const FULL: ViewStyle = { flex: 1 }

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

	function handleSetDiscType(disc: string) {
		goBack()
		type.set(disc)
	}

	return (
		<View style={FULL}>
			<Screen backgroundColor="#fff">
				<Header leftIcon="back" title="Disc Type" onLeftPress={goBack} />
				<ScrollView>
					{DiscTypes.map((disc) => {
						return (
							<Pressable onPress={() => handleSetDiscType(disc)} key={disc} style={SELECTION_CONTAINER}>
								<Text style={type.value === disc ? [SELECTION_TEXT, SELECTED] : SELECTION_TEXT}>{disc}</Text>
								{type.value === disc && <CheckIcon size={20} />}
							</Pressable>
						)
					})}
				</ScrollView>
			</Screen>
		</View>
	)
})
