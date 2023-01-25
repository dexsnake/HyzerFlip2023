import Stripe from 'stripe'
import { api } from '../../services/api'

export async function deletePaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
	try {
		const response = await api.apisauce.get<Stripe.PaymentMethod>(`/stripe/payment-method/delete/${paymentMethodId}`)
		if (!response.ok) throw new Error(response.originalError.response.data)
		return response.data
	} catch (error) {
		throw new Error(error.message)
	}
}
