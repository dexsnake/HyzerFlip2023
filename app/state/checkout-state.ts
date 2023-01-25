import { createState } from '@hookstate/core'
import Stripe from 'stripe'
import { Listing } from '../../types'

export interface CheckoutState {
	listing: Listing | null
	address: string
	payment: Stripe.PaymentMethod | null
	applePay: boolean
}

export const initialCheckoutStoreState: CheckoutState = {
	listing: null,
	address: null,
	payment: null,
	applePay: false
}
export const checkoutStore = createState(initialCheckoutStoreState)

export function clearCheckoutStore() {
	checkoutStore.set({
		listing: null,
		address: null,
		payment: null,
		applePay: false
	})
}
