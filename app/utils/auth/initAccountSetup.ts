import { CustomerAPI } from '../../services/api/customer-api'
import { supabase } from '../../clients/supabase'

export async function initAccountSetup(
	id: string,
	email: string,
	fullName: { givenName: string; familyName: string } | { givenName: string; familyName: string },
	username?: string
) {
	try {
		// Create a customer in Stripe
		const response = await CustomerAPI.createCustomer(id, fullName.givenName, fullName.familyName, email)
		if (response.kind !== 'ok') throw new Error('Could not create customer')

		// Get the id from the customer object
		const stripecustomer_id = response.customer.id

		const { error } = await supabase.from('profiles').insert({
			id: id,
			username: username || '',
			email: email || '',
			first_name: fullName.givenName || '',
			last_name: fullName.familyName || '',
			merchant_id: '',
			customer_id: stripecustomer_id,
			fast_responder: false,
			quick_shipper: false,
			reliable: false,
			image_url: 'https://res.cloudinary.com/hyzer-flip-app/image/upload/v1651024234/default-avatar_geqllc.png',
			description: '',
			setup_complete: false
		})

		if (error) throw new Error(error.message)
	} catch (error) {
		throw error.message
	}
}
