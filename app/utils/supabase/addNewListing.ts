import { SellState } from '../../state/sell-state'
import { supabase } from '../../clients/supabase'

export default async function addNewListing(store: Partial<SellState>, user_id: string, imageUrls: string[]) {
	try {
		const { error } = await supabase.from('listings').insert({
			...store,
			price: parseInt(store.price),
			shipping_cost: store.free_shipping ? 0 : parseInt(store.shipping_cost),
			images: imageUrls,
			tags: [],
			user_id,
			likes: 0,
			status: 'active',
			views: 0
		})
		if (error) throw new Error(error.message)
	} catch (error) {
		throw error.message
	}
}
