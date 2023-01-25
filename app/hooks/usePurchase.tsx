import { useState, useEffect } from 'react'
import { Listing, Sale } from '../../types'
import { supabase } from '../clients/supabase'

export interface SaleWithListing extends Sale {
	listing: Listing
}

export default function usePurchase(saleId: string, refresh?: boolean) {
	const [purchase, setPurchase] = useState<SaleWithListing | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getPurchase() {
			try {
				const { data, error } = await supabase.from('sales').select('*, listing:listings (*)').eq('id', saleId).single()
				if (error) throw new Error(error.message)
				// @ts-ignore
				setPurchase(data)
				setLoading(false)
			} catch (error) {
				setLoading(false)
				console.log(error.message)
			}
		}
		if (saleId) {
			getPurchase()
		}
	}, [saleId, refresh])

	return { purchase, loading }
}
