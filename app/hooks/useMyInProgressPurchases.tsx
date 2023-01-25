import { useState, useEffect, useContext } from 'react'
import { ProfileContext } from '../context/Profile'
import { supabase } from '../clients/supabase'
import { SaleWithListing } from './usePurchase'

export default function useMyInProgressPurchases(isFocused: boolean) {
	const { profile } = useContext(ProfileContext)
	const [purchases, setPurchases] = useState<SaleWithListing[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getMyInProgressPurchases() {
			try {
				const { data, error } = await supabase
					.from('sales')
					.select('*, listing:listings (*)')
					.eq('buyer_id', profile.id)
					.in('status', ['awaiting shipping', 'shipped', 'delivered'])
				if (error) throw new Error(error.message)
				// @ts-ignore
				setPurchases(data)
			} catch (error) {
				console.log(error.message)
			} finally {
				setLoading(false)
			}
		}
		if (isFocused) {
			getMyInProgressPurchases()
		}
	}, [isFocused])

	return { purchases, loading }
}
