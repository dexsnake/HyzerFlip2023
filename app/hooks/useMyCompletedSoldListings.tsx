import { useState, useEffect, useContext } from 'react'
import { ProfileContext } from '../context/Profile'
import { supabase } from '../clients/supabase'
import { SaleWithListing } from './usePurchase'

export default function useMyCompletedSoldListings(refresh?: boolean) {
	const { profile } = useContext(ProfileContext)
	const [listings, setListings] = useState<SaleWithListing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		async function getMyCompletedSoldListings() {
			try {
				const { data, error } = await supabase
					.from('sales')
					.select('*, listing:listings (*)')
					.eq('seller_id', profile.id)
					.in('status', ['complete'])
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
		getMyCompletedSoldListings()
	}, [refresh])

	return { listings, loading, error }
}
