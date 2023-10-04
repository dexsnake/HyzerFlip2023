import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle, Text, Pressable, ScrollView } from 'react-native'
import { Header, Screen } from '../../components'
import { SellStackParamsList } from '../../navigators/stacks/Sell'
import { useHookstate } from '@hookstate/core'
import { sellStore } from '../../state/sell-state'
import DiscConditions from '../../constants/DiscConditions'
import { CheckIcon } from 'react-native-heroicons/outline'

export const DiscConditionScreen: FC<StackScreenProps<SellStackParamsList, 'disc-condition'>> = observer(({ navigation }) => {
	const { condition } = useHookstate(sellStore)
	const goBack = () => navigation.goBack()

	const [containerWidth, setContainerWidth] = React.useState(0)

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
	const SELECTION_TEXT_TOP: TextStyle = { color: '#1f2937', fontWeight: '500', marginBottom: 5, fontSize: 15 }
	const SELECTION_TEXT_BOTTOM: TextStyle = { lineHeight: 18, letterSpacing: 0.6, color: 'gray', maxWidth: containerWidth - 16 - 60 }
	const SELECTED: TextStyle = { color: '#2563EB' }

	function handleSetDiscCondition(cond: string) {
		goBack()
		condition.set(cond)
	}

	return (
		<View style={FULL}>
			<Screen backgroundColor="#fff">
				<Header leftIcon="back" title="Condition" onLeftPress={goBack} />
				<ScrollView onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
					{DiscConditions.sort((a, b) => parseInt(b.rating) - parseInt(a.rating)).map((cond) => {
						return (
							<Pressable onPress={() => handleSetDiscCondition(cond.rating)} key={cond.rating} style={SELECTION_CONTAINER}>
								<View>
									<Text style={condition.value === cond.rating ? [SELECTION_TEXT_TOP, SELECTED] : SELECTION_TEXT_TOP}>{cond.rating}</Text>
									<Text style={condition.value === cond.rating ? [SELECTION_TEXT_BOTTOM, SELECTED] : SELECTION_TEXT_BOTTOM}>{cond.description}</Text>
								</View>
								{condition.value === cond.rating && <CheckIcon size={20} />}
							</Pressable>
						)
					})}
				</ScrollView>
			</Screen>
		</View>
	)
})
