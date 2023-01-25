import Stripe from 'stripe'
import { supabase } from '../../clients/supabase'

export async function createSale(
	buyer: string,
	seller: string,
	listing: string,
	paymentId: string,
	price: number,
	shipping: number,
	customer_id: string,
	merchantId: string,
	shippingAddress: Stripe.Customer.Shipping
) {
	try {
		const { data, error } = await supabase
			.from('sales')
			.insert({
				buyer_id: buyer,
				seller_id: seller,
				listing_id: listing,
				payment_id: paymentId,
				price,
				status: 'awaiting shipping',
				shipping_price: shipping,
				customer_id: customer_id,
				merchant_id: merchantId,
				shipping_address: shippingAddress
			})
			.select('id')
			.single()
		if (error) throw new Error(error.message)
		return data
	} catch (error) {
		throw new Error(error.message)
	}
}
