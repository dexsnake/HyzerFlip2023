import { ApiResponse, PROBLEM_CODE } from 'apisauce'
import Stripe from 'stripe'
import { api } from './api'
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem'

export const CustomerAPI = {
	async getCustomer(id: string): Promise<{ kind: 'ok'; customer: Stripe.Customer } | GeneralApiProblem> {
		try {
			const response: ApiResponse<Stripe.Customer> = await api.apisauce.post(`/stripe/customer/retrieve/${id}`)
			if (!response.ok) {
				const problem = getGeneralApiProblem(response)
				if (problem) return problem
			}
			const customer = response.data

			return { kind: 'ok', customer }
		} catch (error) {
			return { kind: 'bad-data' }
		}
	},
	async createCustomer(uid: string, firstName: string, lastName: string, email: string): Promise<{ kind: 'ok'; customer: Stripe.Customer } | GeneralApiProblem> {
		try {
			const response: ApiResponse<Stripe.Customer> = await api.apisauce.post('/stripe/customer/create/', {
				email: email || '',
				firstName: firstName || '',
				lastName: lastName || '',
				uid: uid
			})
			if (!response.ok) {
				const problem = getGeneralApiProblem(response)
				if (problem) return problem
			}
			const customer = response.data

			return { kind: 'ok', customer }
		} catch (error) {
			return { kind: 'bad-data' }
		}
	},
	async updateCustomer(id: string, fields: Stripe.CustomerUpdateParams): Promise<{ kind: 'ok'; customer: Stripe.Customer } | { kind: PROBLEM_CODE; message: string }> {
		try {
			const response: ApiResponse<Stripe.Customer> = await api.apisauce.patch('/stripe/customer/update/', { id, fields })
			if (!response.ok) {
				return { kind: response.problem, message: response.originalError.response.data }
			}
			const customer = response.data

			return { kind: 'ok', customer }
		} catch (error) {
			return { kind: 'CLIENT_ERROR', message: error.message }
		}
	}
}
