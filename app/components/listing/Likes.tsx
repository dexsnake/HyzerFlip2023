import React, { useCallback, useContext, useEffect } from 'react'
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { ProfileContext } from '../../context/Profile'
import { likeListing, unlikeListing } from '../../utils/supabase/handleListingLikes'
import { navigate } from '../../navigators'
import { Listing } from '../../../types'
import { HeartIcon } from 'react-native-heroicons/outline'
import { HeartIcon as HeartIconSolid } from 'react-native-heroicons/solid'
import useAuth from '../../hooks/useAuth'

interface Props {
	item: Listing
}

export default function Likes({ item }: Props) {
	const { session } = useAuth()
	const { likes: likedListings } = useContext(ProfileContext)
	const [liked, setLiked] = React.useState(likedListings ? likedListings.filter((like) => like.id === item.id).length > 0 : false)
	const [likes, setLikes] = React.useState(item.likes)

	useEffect(() => {
		setLiked(likedListings.filter((like) => like.id === item.id).length > 0)
	}, [likedListings])

	const handleLikes = useCallback(() => {
		if (liked) {
			setLiked(false)
			setLikes((prevState) => prevState - 1)
			unlikeListing(item.id, session.user.id)
		} else {
			setLiked(true)
			setLikes((prevState) => prevState + 1)
			likeListing(item.id, session.user.id)
		}
	}, [liked])

	const LIKE_CONTAINER: ViewStyle = { display: 'flex', alignItems: 'center' }
	const LIKE_BUTTON: ViewStyle = {
		width: 36,
		height: 36,
		borderRadius: 18,
		paddingTop: 2,
		borderWidth: 1,
		borderColor: liked ? '#2563EB' : 'gray',
		backgroundColor: liked ? '#2563EB' : '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	}
	const LIKE_TEXT: TextStyle = { fontSize: 12, marginTop: 10 }
	const LIKES: TextStyle = { fontWeight: '600', fontSize: 14 }

	return (
		<View style={LIKE_CONTAINER}>
			{session?.user.id !== item.user_id && (
				<Pressable onPress={() => (session?.user ? handleLikes() : navigate('auth'))} style={LIKE_BUTTON}>
					{liked ? <HeartIconSolid size={24} color={liked ? 'white' : 'gray'} /> : <HeartIcon size={24} color={liked ? 'white' : 'gray'} />}
				</Pressable>
			)}
			{likes ? (
				<Text style={LIKE_TEXT}>
					<Text style={LIKES}>{likes}</Text> Like{likes > 1 && 's'}
				</Text>
			) : null}
		</View>
	)
}
