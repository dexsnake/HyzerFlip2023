import { useState, useEffect, useContext } from 'react'
import { Listing } from '../../types'
import { ProfileContext } from '../context/Profile'
import { supabase } from '../clients/supabase'

export default function useMyActiveListings(isFocused: boolean) {
	const { profile } = useContext(ProfileContext)
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getMyCompletedListings() {
			try {
				const { data: listings, error } = await supabase
					.from('listings')
					.select('*')
					.eq('user_id', profile.id)
					.eq('status', 'completed')
					.order('sold_at', { ascending: false })
				if (error) throw new Error(error.message)
				setListings(listings)
				setLoading(false)
			} catch (error) {
				setLoading(false)
				console.log(error.message)
			}
		}
		if (isFocused) {
			getMyCompletedListings()
		}
	}, [isFocused])

	return { listings, loading }
}
