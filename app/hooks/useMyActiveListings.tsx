import { useState, useEffect, useContext } from 'react'
import { Listing } from '../../types'
import { ProfileContext } from '../context/Profile'
import { supabase } from '../clients/supabase'

export default function useMyActiveListings(isFocused: boolean) {
	const { profile } = useContext(ProfileContext)
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getMyActiveListings() {
			try {
				const { data: listings, error } = await supabase
					.from('listings')
					.select('*')
					.eq('user_id', profile.id)
					.in('status', ['active', 'inactive', 'draft'])
					.order('created_at', { ascending: false })
				if (error) throw new Error(error.message)
				setListings(listings)
				setLoading(false)
			} catch (error) {
				setLoading(false)
				console.log(error.message)
			}
		}
		if (isFocused) {
			getMyActiveListings()
		}
	}, [isFocused])

	return { listings, loading }
}
