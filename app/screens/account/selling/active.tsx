import { useNavigation, useIsFocused } from '@react-navigation/native'
import React from 'react'
import { View, FlatList, ViewStyle, ActivityIndicator } from 'react-native'
import PostCard from '../../../components/post-card/post-card'
import useMyActiveListings from '../../../hooks/useMyActiveListings'
import { spacing } from '../../../theme'
import EmptyListings from './empty-listings'

export default function ActiveListings() {
	const navigation = useNavigation()
	const isFocused = useIsFocused()
	const { listings, loading } = useMyActiveListings(isFocused)

	const CONTAINER: ViewStyle = { flex: 1, backgroundColor: '#fff', paddingTop: 16 }

	return (
		<View style={CONTAINER}>
			{loading && <ActivityIndicator />}
			<FlatList
				ListEmptyComponent={<EmptyListings page="active" />}
				numColumns={2}
				data={listings}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <PostCard cols={2} active item={item} navigation={navigation} />}
			/>
		</View>
	)
}
