import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Header, Screen } from '../../../components'
import { ProfileContext } from '../../../context/Profile'
import useBalance from '../../../hooks/useBalance'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import formatPrice from '../../../utils/formatPrice'

export const BalanceScreen: FC<StackScreenProps<SettingsStackParamsList, 'balance-screen'>> = ({ navigation, route }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const { profile } = useContext(ProfileContext)
	const { balance, loading } = useBalance(profile.merchant_id)
	const [isBalanceZero, setIsBalanceZero] = useState(true)

	useEffect(() => {
		if (balance) setIsBalanceZero(balance.available[0].amount === 0)
	}, [balance])

	return (
		<View className="flex-1">
			<Screen backgroundColor="#fff">
				<Header title="My balance" leftIcon="back" onLeftPress={goBack} />
				<View className="px-4">
					<View className="bg-white rounded shadow-md mt-4 items-center p-4">
						<Text className="text-lg font-semibold text-gray-800 mb-1">Balance</Text>
						<Text className="text-3xl font-medium text-gray-800 mb-2">{loading ? formatPrice(0) : formatPrice(balance.available[0].amount / 100)}</Text>
						<Text className="text-gray-600 text-xs">
							Available soon: <Text className="text-gray-600 font-medium text-xs">{loading ? formatPrice(0) : formatPrice(balance.pending[0].amount / 100)}</Text>
						</Text>
						<View className="border-t-gray-300 border-t-[0.75px] w-full items-center mt-4 pt-4">
							<TouchableOpacity>
								<Text className={`${isBalanceZero ? 'text-gray-300' : 'text-flip-100'} font-semibold tracking-wide`}>Transfer balance</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Screen>
		</View>
	)
}
