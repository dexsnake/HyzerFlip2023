import { useState, useEffect } from 'react'
import { Profile, Review } from '../../types'
import { supabase } from '../clients/supabase'
import { SaleWithListing } from './usePurchase'

export default function useProfile(id: string) {
	const [profile, setProfile] = useState<Profile>(null)
	const [sales, setSales] = useState<SaleWithListing[]>([])
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const completedSales = sales.filter((s) => s.status === 'complete') || []

	const sellReviews = reviews.filter((r) => r.transaction === 'buy')
	const buyReviews = reviews.filter((r) => r.transaction === 'sell')

	const averageSellReivew = sellReviews.length > 0 ? (sellReviews.reduce((acc, cur) => acc + cur.rating, 0) / sellReviews.length).toFixed(1) : 0
	const averageBuyReivew = buyReviews.length > 0 ? (buyReviews.reduce((acc, cur) => acc + cur.rating, 0) / buyReviews.length).toFixed(1) : 0

	async function getUserProfile(id: string) {
		try {
			const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single()
			if (profileError) throw new Error(profileError.message)
			// @ts-ignore
			setProfile(profile)
			setError('')
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (id) getUserProfile(id)
	}, [id])

	useEffect(() => {
		async function getSales() {
			try {
				const { data, error } = await supabase.from('sales').select('listing:listings (*)').eq('seller_id', profile.id)
				if (error && error.details.includes('Results contain 0 rows')) return
				else if (error) throw new Error(error.message)
				// @ts-ignore
				setSales(data.map(({ listing }) => ({ ...listing })))
			} catch (error) {
				setError(error.message)
			}
		}
		if (profile) getSales()
	}, [profile])

	useEffect(() => {
		async function getReviews() {
			try {
				const { data, error } = await supabase.from('reviews').select('*').eq('reviewee_id', profile.id)
				if (error && error.details.includes('Results contain 0 rows')) return
				else if (error) throw new Error(error.message)
				// @ts-ignore
				setReviews(data)
			} catch (error) {
				setError(error.message)
			}
		}
		if (profile) getReviews()
	}, [profile])

	return { profile, sales, completedSales, reviews, loading, error, sellReviews, buyReviews, averageSellReivew, averageBuyReivew }
}
