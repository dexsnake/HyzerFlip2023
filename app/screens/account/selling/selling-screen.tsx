import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { Header, Screen } from '../../../components'
import { AccountStackParamsList } from '../../../navigators/stacks/Account'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import ActiveListings from './active'
import SoldListings from './sold'
import CompletedListings from './completed'

export const SellingScreen: FC<StackScreenProps<AccountStackParamsList, 'selling'>> = ({ navigation }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const [index, setIndex] = React.useState(0)
	const [routes] = React.useState([
		{ key: 'active', title: 'Listings' },
		{ key: 'sold', title: 'Sold' },
		{ key: 'completed', title: 'Completed' }
	])

	return (
		<Screen backgroundColor="#fff">
			<Header title="Selling" border={false} leftIcon="back" onLeftPress={goBack} />
			<TabView renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
		</Screen>
	)
}

const renderTabBar = (props) => (
	<TabBar
		{...props}
		labelStyle={{ color: '#4b5563', textTransform: 'none', fontSize: 14 }}
		activeColor="#334155"
		indicatorStyle={{ backgroundColor: '#334155' }}
		style={{ backgroundColor: '#fff' }}
	/>
)

const renderScene = SceneMap({
	active: ActiveListings,
	sold: SoldListings,
	completed: CompletedListings
})
