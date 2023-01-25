import { useState, useEffect } from 'react'
import { supabase } from '../clients/supabase'
import { Listing } from '../../types'

export default function useProfileListings(id: string, refresh?: boolean) {
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	async function getListingsById(id: string) {
		try {
			if (!id) throw new Error('No listing id provided')
			const { data, error } = await supabase.from('listings').select('*').eq('user_id', id)
			if (error) throw new Error(error.message)
			setError('')
			setListings(data)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (id) getListingsById(id)
	}, [id, refresh])

	return { listings, loading, error }
}
