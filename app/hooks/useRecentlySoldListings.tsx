import { useState, useEffect } from 'react'
import { subHours } from 'date-fns'
import { Listing } from '../../types'
import { supabase } from '../clients/supabase'

export default function useRecentlySoldListings(refresh?: boolean) {
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const RECENTLY_SOLD_HOURS = 100000

	async function getRecentlySoldListings() {
		try {
			const { data: listings, error } = await supabase
				.from('listings')
				.select('*')
				.eq('status', 'sold')
				.gt('sold_at', subHours(new Date(), RECENTLY_SOLD_HOURS).toISOString())
				.order('sold_at', { ascending: false })
				.limit(10)
			if (error) throw new Error(error.message)
			setListings(listings)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getRecentlySoldListings()
	}, [refresh])

	return { listings, loading, error }
}
