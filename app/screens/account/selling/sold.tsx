import { useIsFocused, useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, FlatList } from 'react-native'
import PurchaseCard from '../../../components/purchase-card'
import useMySoldListings from '../../../hooks/useMySoldListings'
import EmptyListings from './empty-listings'

export default function SoldListings() {
	const navigation = useNavigation()
	const isFocused = useIsFocused()
	const { listings } = useMySoldListings(isFocused)

	return (
		<View className="bg-white flex flex-1 pt-4">
			<FlatList
				ListEmptyComponent={<EmptyListings page="sold" />}
				numColumns={1}
				data={listings}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={{ paddingHorizontal: 12 }}
				renderItem={({ item }) => <PurchaseCard view="selling" item={item} showLikes showViews navigation={navigation} />}
			/>
		</View>
	)
}
