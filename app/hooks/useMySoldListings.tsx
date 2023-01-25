import { useState, useEffect, useContext } from 'react'
import { ProfileContext } from '../context/Profile'
import { supabase } from '../clients/supabase'
import { SaleWithListing } from './usePurchase'

export default function useMyActiveListings(refresh?: boolean) {
	const { profile } = useContext(ProfileContext)
	const [listings, setListings] = useState<SaleWithListing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		async function getMySoldListings() {
			try {
				const { data, error } = await supabase
					.from('sales')
					.select('*, listing:listings (*)')
					.eq('seller_id', profile.id)
					.in('status', ['awaiting shipping', 'shipped', 'delivered'])
					.order('created_at', { ascending: false })
				if (error) throw new Error(error.message)
				setError('')
				// @ts-ignore
				setListings(data)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		getMySoldListings()
	}, [refresh])

	return { listings, loading, error }
}
