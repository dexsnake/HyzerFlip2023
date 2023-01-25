import { useState, useEffect } from 'react'
import { supabase } from '../clients/supabase'
import { Listing } from '../../types'

export default function useListing(id: string, refresh?: boolean) {
	const [listing, setListing] = useState<Listing>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	async function getListingById(id: string) {
		try {
			if (!id) throw new Error('No listing id provided')
			const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
			if (error) throw new Error(error.message)
			setError('')
			setListing(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (id) getListingById(id)
	}, [id, refresh])

	return { listing, loading, error }
}
