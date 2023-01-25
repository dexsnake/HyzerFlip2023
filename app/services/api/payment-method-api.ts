import { ApiResponse } from 'apisauce'
import Stripe from 'stripe'
import { api } from './api'
import { GeneralApiProblem, getGeneralApiProblem } from './apiProblem'

export const PaymentMethodAPI = {
	async getPaymentMethods(id: string): Promise<{ kind: 'ok'; paymentMethods: Stripe.PaymentMethod[] } | GeneralApiProblem> {
		try {
			const response: ApiResponse<Stripe.PaymentMethod[]> = await api.apisauce.post('/stripe/customer/payment-method/list/', { id })
			if (!response.ok) {
				const problem = getGeneralApiProblem(response)
				if (problem) return problem
			}
			const paymentMethods = response.data

			return { kind: 'ok', paymentMethods }
		} catch (error) {
			return { kind: 'bad-data' }
		}
	},
	async deletePaymentMethod(id: string): Promise<{ kind: 'ok'; paymentMethod: Stripe.PaymentMethod } | GeneralApiProblem> {
		try {
			const response: ApiResponse<Stripe.PaymentMethod> = await api.apisauce.post(`/stripe/payment-method/delete/${id}`)
			if (!response.ok) {
				const problem = getGeneralApiProblem(response)
				if (problem) return problem
			}
			const paymentMethod = response.data
			return { kind: 'ok', paymentMethod }
		} catch (error) {
			return { kind: 'bad-data' }
		}
	}
}
