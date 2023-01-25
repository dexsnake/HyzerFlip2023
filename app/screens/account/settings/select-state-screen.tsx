import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { TextStyle, View, ViewStyle, Text, Pressable } from 'react-native'
import { Header, Screen } from '../../../components'
import { colors, spacing } from '../../../theme'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import { useState } from '@hookstate/core'
import { addressStore } from '../../../state/address-state'
import { CheckIcon } from 'react-native-heroicons/outline'

export const SelectStateScreen: FC<StackScreenProps<SettingsStackParamsList, 'select-state'>> = ({ navigation, route }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const store = useState(addressStore)

	const states = [
		'Alabama',
		'Alaska',
		'American Samoa',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'District of Columbia',
		'Federated States of Micronesia',
		'Florida',
		'Georgia',
		'Guam',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Marshall Islands',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Northern Mariana Islands',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Palau',
		'Pennsylvania',
		'Puerto Rico',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virgin Island',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming'
	]

	const FULL: ViewStyle = { flex: 1 }

	const HEADER: TextStyle = {
		paddingTop: 28,
		paddingBottom: 16,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		borderBottomColor: '#d1d5db',
		borderBottomWidth: 0.75
	}
	const HEADER_TITLE: TextStyle = {
		color: '#1f2937',
		fontWeight: '500',
		textAlign: 'center',
		letterSpacing: 1.2
	}

	const STATE_CONTAINER: ViewStyle = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		borderBottomColor: '#d1d5db',
		borderBottomWidth: 0.75,
		paddingHorizontal: 16
	}
	const STATE_TEXT: TextStyle = { color: '#1f2937' }

	return (
		<View style={FULL}>
			<Screen preset="scroll" backgroundColor="#fff">
				<Header title="Select one" leftIcon="bell" onLeftPress={goBack} />
				{states.map((state) => {
					return (
						<Pressable
							onPress={() => {
								store.state.set(state)
								navigation.navigate('address')
							}}
							key={state}
							style={STATE_CONTAINER}
						>
							<Text style={STATE_TEXT}>{state}</Text>
							{store.state.value === state && <CheckIcon size={20} />}
						</Pressable>
					)
				})}
			</Screen>
		</View>
	)
}
