import { useState, useEffect } from 'react'
import { subHours } from 'date-fns'
import { Listing } from '../../types'
import { supabase } from '../clients/supabase'

export default function useNewListings(refresh?: boolean) {
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const NEW_LISTING_HOURS = 1000000

	async function getNewListings() {
		try {
			const { data: listings, error } = await supabase
				.from('listings')
				.select('*')
				.eq('status', 'active')
				.gt('created_at', subHours(new Date(), NEW_LISTING_HOURS).toISOString())
				.order('created_at', { ascending: false })
				.limit(20)
			if (error) throw new Error(error.message)
			setListings(listings)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getNewListings()
	}, [refresh])

	return { listings, loading, error }
}
