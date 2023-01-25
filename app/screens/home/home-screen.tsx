import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext, useState } from 'react'
import { Text, TextStyle, View, ViewStyle, FlatList, TextInput } from 'react-native'
import { Screen } from '../../components'
import { HomeStackParamsList } from '../../navigators/stacks/Home'
import ProfileSetupModal from '../../components/modals/profile-setup-modal'
import { ProfileContext } from '../../context/Profile'
import useNewListings from '../../hooks/useNewListings'
import PostCardHorizontal from '../../components/post-card/post-card-horizontal'
import useRecentlySoldListings from '../../hooks/useRecentlySoldListings'
import { useIsFocused } from '@react-navigation/native'

export const HomeScreen: FC<StackScreenProps<HomeStackParamsList, 'welcome'>> = ({ navigation }) => {
	const { profile } = useContext(ProfileContext)
	const focused = useIsFocused()
	const { listings: newListings, error: newListingsError } = useNewListings(focused)
	const { listings: recentlySoldListings, error: recentlySoldListingsError } = useRecentlySoldListings(focused)
	const [search, setSearch] = useState('')

	const [isProfileSetupModalOpen, setIsProfileSetupModalOpen] = useState(false)

	const handleModalClose = () => setIsProfileSetupModalOpen(false)

	const FULL: ViewStyle = { flex: 1 }
	const CONTAINER: ViewStyle = {
		backgroundColor: 'transparent',
		paddingHorizontal: 16
	}

	const INPUT: TextStyle = {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 14,
		borderRadius: 4,
		backgroundColor: '#fff',
		color: '#1f2937',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.2,
		shadowRadius: 2.41,

		elevation: 2
	}
	const SECTION_TITLE: TextStyle = { fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 12 }
	const FLATLIST_CONTAINER: ViewStyle = { marginHorizontal: -6, flexGrow: 0, marginBottom: 30 }

	return (
		<View className="flex-1">
			<Screen preset="auto" safeAreaEdges={['top', 'bottom']} statusBarStyle="dark" backgroundColor="#fff">
				<View className="px-4">
					<View style={{ paddingVertical: 12 }}>
						<TextInput value={search} placeholderTextColor={'gray'} onChangeText={(text) => setSearch(text)} placeholder="Search for anything" style={INPUT} />
					</View>
					<Text className="text-xl font-semibold text-slate-700 mb-3">New Dics</Text>
					{newListingsError && <Text className="text-red-500">{newListingsError}</Text>}
					<FlatList
						data={newListings}
						style={FLATLIST_CONTAINER}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => <PostCardHorizontal item={item} navigation={navigation} />}
					/>
					<Text style={SECTION_TITLE}>Recently Sold Dics</Text>
					{newListingsError && <Text className="text-red-500">{recentlySoldListingsError}</Text>}

					<FlatList
						data={recentlySoldListings}
						style={FLATLIST_CONTAINER}
						keyExtractor={(item) => item.id}
						horizontal
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => <PostCardHorizontal item={item} navigation={navigation} />}
					/>
				</View>
				{profile && <ProfileSetupModal isModalOpen={isProfileSetupModalOpen} handleModalClose={handleModalClose} />}
			</Screen>
		</View>
	)
}
