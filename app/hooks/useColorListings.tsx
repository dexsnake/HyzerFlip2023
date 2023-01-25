import { useState, useEffect } from 'react'
import { Listing } from '../../types'

export default function useColorListings(color: string) {
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		// setLoading(true)
		// const subscriber = db
		// 	.collection('Listings')
		// 	.where('status', '==', 'active')
		// 	.where('color', '==', color)
		// 	.limit(8)
		// 	.orderBy('createdAt', 'desc')
		// 	.onSnapshot(
		// 		(snapshot) => {
		// 			const listingDocs = snapshot.docs.map((doc) => ({
		// 				id: doc.id,
		// 				...doc.data()
		// 			}))
		// 			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// 			// @ts-ignore
		// 			setListings(listingDocs)
		// 			setLoading(false)
		// 			setError('')
		// 		},
		// 		(error) => {
		// 			setError(error.message)
		// 			console.log(error.message)
		// 		}
		// 	)
		// return () => {
		// 	subscriber()
		// }
	}, [color])

	return { listings, loading, error }
}
