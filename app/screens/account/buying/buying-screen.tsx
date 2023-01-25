import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { Header, Screen } from '../../../components'
import { AccountStackParamsList } from '../../../navigators/stacks/Account'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import CompletedPurchases from './completed'
import InProgressPurchases from './in-progress'

export const BuyingScreen: FC<StackScreenProps<AccountStackParamsList, 'buying'>> = ({ navigation }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const [index, setIndex] = React.useState(0)
	const [routes] = React.useState([
		{ key: 'in progress', title: 'In Progress' },
		{ key: 'completed', title: 'Completed' }
	])

	return (
		<Screen backgroundColor="#fff">
			<Header title="Buying" border={false} leftIcon="back" onLeftPress={goBack} />
			<TabView renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
		</Screen>
	)
}

const renderTabBar = (props) => (
	<TabBar
		{...props}
		labelStyle={{ color: 'gray', textTransform: 'none', fontSize: 14 }}
		activeColor="#374151"
		indicatorStyle={{ backgroundColor: '#374151' }}
		style={{ backgroundColor: '#fff' }}
	/>
)

const renderScene = SceneMap({
	'in progress': InProgressPurchases,
	completed: CompletedPurchases
})
