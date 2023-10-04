import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle, Text, Pressable, ScrollView } from 'react-native'
import { Header, Screen } from '../../components'
import { SellStackParamsList } from '../../navigators/stacks/Sell'
import { useHookstate } from '@hookstate/core'
import { sellStore } from '../../state/sell-state'
import DiscColors from '../../constants/DiscColors'
import { LinearGradient } from 'expo-linear-gradient'
import { CheckIcon } from 'react-native-heroicons/outline'

export const DiscColorScreen: FC<StackScreenProps<SellStackParamsList, 'disc-color'>> = observer(({ navigation }) => {
	const { color } = useHookstate(sellStore)
	const goBack = () => navigation.goBack()
	const FULL: ViewStyle = { flex: 1 }
	const HEADER: TextStyle = {
		paddingTop: 28,
		paddingBottom: 16,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 0.75,
		borderBottomColor: '#374151'
	}
	const HEADER_TITLE: TextStyle = {
		color: '#1f2937',
		textAlign: 'center',
		fontWeight: '500',
		letterSpacing: 1.2
	}

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
	const SELECTION_WRAPPER: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' }
	const SELECTION_COLOR: ViewStyle = { height: 20, width: 20, borderRadius: 10, marginRight: 25 }
	const WHITE: ViewStyle = { borderWidth: 0.75, borderColor: '#374151' }
	const SELECTION_TEXT: TextStyle = { color: '#1f2937' }
	const SELECTED: TextStyle = { color: '#2563EB' }

	function handleSetDiscType(discColor: string) {
		goBack()
		color.set(discColor)
	}

	return (
		<View style={FULL}>
			<Screen backgroundColor="#fff">
				<Header leftIcon="back" title="Color" onLeftPress={goBack} />
				<ScrollView>
					{DiscColors.map((discColor) => {
						return (
							<Pressable onPress={() => handleSetDiscType(discColor.name)} key={discColor.name} style={SELECTION_CONTAINER}>
								<View style={SELECTION_WRAPPER}>
									{discColor.name === 'Multi-Color' ? (
										<LinearGradient style={SELECTION_COLOR} colors={['#7869CF', '#00D7D8', '#0DF396', '#FCEA69', '#FFB079', '#FF767E']} />
									) : (
										<View
											style={
												discColor.name === 'White'
													? [SELECTION_COLOR, { backgroundColor: discColor.hex }, WHITE]
													: [SELECTION_COLOR, { backgroundColor: discColor.hex }]
											}
										></View>
									)}
									<Text style={color.value === discColor.name ? [SELECTION_TEXT, SELECTED] : SELECTION_TEXT}>{discColor.name}</Text>
								</View>
								{color.value === discColor.name && <CheckIcon size={20} />}
							</Pressable>
						)
					})}
				</ScrollView>
			</Screen>
		</View>
	)
})
