import { ApiResponse } from 'apisauce'
import { api } from './api'
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem'
import Stripe from 'stripe'

export const BalanceAPI = {
	async getBalance(id: string): Promise<{ kind: 'ok'; balance: Stripe.Balance } | GeneralApiProblem> {
		try {
			const response: ApiResponse<Stripe.Balance> = await api.apisauce.post(`/stripe/balance/retrieve/${id}`)
			if (!response.ok) {
				const problem = getGeneralApiProblem(response)
				if (problem) return problem
			}
			const balance = response.data
			return { kind: 'ok', balance }
		} catch (error) {
			return { kind: 'bad-data' }
		}
	}
}
