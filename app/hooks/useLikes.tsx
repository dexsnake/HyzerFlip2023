import { useState, useEffect, useContext } from 'react'
import { Listing } from '../../types'
import { supabase } from '../clients/supabase'
import { ProfileContext } from '../context/Profile'

export default function useLikes() {
	const { profile } = useContext(ProfileContext)
	const [likes, setLikes] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	async function getLikes() {
		try {
			const { data, error } = await supabase.from('listing_likes').select('listing:listings (*)').eq('user_id', profile.id)
			if (error) throw new Error(error.message)
			setError('')
			// @ts-ignore
			setLikes(data.map(({ listing }) => ({ ...listing })))
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getLikes()
		const likesSubscription = supabase
			.channel('liked_listings_channel')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'listing_likes', filter: `user_id=eq.${profile.id}` }, (payload) => {
				console.log('like change')
				getLikes()
			})
			.subscribe()
		return () => {
			supabase.removeChannel(likesSubscription)
		}
	}, [])

	return { likes, loading, error }
}
