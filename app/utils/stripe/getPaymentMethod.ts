import Stripe from 'stripe'
import { api } from '../../services/api'

export async function getPaymentMethod(paymentMethodId: string | Stripe.PaymentMethod): Promise<Stripe.PaymentMethod> {
	try {
		const response = await api.apisauce.get<Stripe.PaymentMethod>(`/stripe/payment-method/retrieve/${paymentMethodId}`)
		if (!response.ok) throw new Error(response.originalError.response.data)
		return response.data
	} catch (error) {
		throw new Error(error.message)
	}
}
