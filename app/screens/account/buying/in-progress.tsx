import { useNavigation, useIsFocused } from '@react-navigation/native'
import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import PurchaseCard from '../../../components/purchase-card'
import useMyInProgressPurchases from '../../../hooks/useMyInProgressPurchases'
import EmptyListings from './empty-listings'

export default function InProgressPurchases() {
	const navigation = useNavigation()
	const isFocused = useIsFocused()
	const { purchases, loading } = useMyInProgressPurchases(isFocused)

	return (
		<View className="bg-white flex flex-1 pt-4">
			{loading && <ActivityIndicator />}
			<FlatList
				ListEmptyComponent={<EmptyListings page="in progress" />}
				numColumns={1}
				data={purchases}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={{ paddingHorizontal: 12 }}
				renderItem={({ item }) => <PurchaseCard view="buying" item={item} navigation={navigation} />}
			/>
		</View>
	)
}
