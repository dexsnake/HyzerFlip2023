import { supabase } from '../../clients/supabase'

export async function addListingView(listingId: string, user_id?: string): Promise<void> {
	const { error } = await supabase.from('listing_views').insert({
		listing_id: listingId,
		created_at: new Date().toISOString(),
		user_id: user_id || null
	})
	if (error) console.log(error)
}
