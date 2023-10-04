import { useState, useEffect } from 'react'
import Stripe from 'stripe'
import { BalanceAPI } from '../services/api/balance-api'
import { Reactotron } from '../services/reactotron/reactotronClient'

export default function useBalance(id: string, refresh?: boolean) {
	const [balance, setBalance] = useState<Stripe.Balance | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	Reactotron.log(balance, loading)

	useEffect(() => {
		async function getBalance(id: string) {
			try {
				const response = await BalanceAPI.getBalance(id)
				if (response.kind !== 'ok') throw new Error('Could not get customer')
				if (response.kind === 'ok') {
					setBalance(response.balance)
					setError('')
				}
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		if (id) getBalance(id)
	}, [id, refresh])

	return { balance, loading, error }
}
