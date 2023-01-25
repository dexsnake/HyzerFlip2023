import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext } from 'react'
import { FlatList, View } from 'react-native'
import { Header, Screen } from '../../components'
import PostCard from '../../components/post-card/post-card'
import { ProfileContext } from '../../context/Profile'
import { LikesStackParamsList } from '../../navigators/stacks/Likes'

export const LikesScreen: FC<StackScreenProps<LikesStackParamsList, 'likes-screen'>> = ({ navigation }) => {
	const { likes } = useContext(ProfileContext)

	return (
		<Screen backgroundColor="#fff">
			<Header title="My likes" />
			<View className="flex-1">
				<FlatList numColumns={2} data={likes} keyExtractor={(item) => item.id} renderItem={({ item }) => <PostCard cols={2} item={item} navigation={navigation} />} />
			</View>
		</Screen>
	)
}
