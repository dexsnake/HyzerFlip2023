import { useState, useEffect, useContext } from 'react'
import { ProfileContext } from '../context/Profile'
import { supabase } from '../clients/supabase'
import { SaleWithListing } from './usePurchase'

export default function useMyCompletedPurchases(isFocused: boolean) {
	const { profile } = useContext(ProfileContext)
	const [purchases, setPurchases] = useState<SaleWithListing[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getMyCompletedPurchases() {
			try {
				const { data, error } = await supabase.from('sales').select('*, listing:listings (*)').eq('buyer_id', profile.id).in('status', ['complete'])
				if (error) throw new Error(error.message)
				// @ts-ignore
				setPurchases(data)
			} catch (error) {
				console.log(error.message)
			} finally {
				setLoading(false)
			}
		}
		getMyCompletedPurchases()
	}, [isFocused])

	return { purchases, loading }
}
