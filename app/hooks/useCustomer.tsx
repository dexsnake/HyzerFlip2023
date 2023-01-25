import { useState, useEffect } from 'react'
import Stripe from 'stripe'
import { CustomerAPI } from '../services/api/customer-api'

export default function useCustomer(id: string, refresh?: boolean) {
	const [customer, setCustomer] = useState<Stripe.Customer | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		async function getCustomer(id: string) {
			try {
				const response = await CustomerAPI.getCustomer(id)
				if (response.kind !== 'ok') throw new Error('Could not get customer')
				if (response.kind === 'ok') {
					setCustomer(response.customer)
					setError('')
				}
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		if (id) getCustomer(id)
	}, [id, refresh])

	return { customer, loading, error }
}
