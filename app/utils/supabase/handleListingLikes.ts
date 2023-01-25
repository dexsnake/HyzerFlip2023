import { supabase } from '../../clients/supabase'

export async function likeListing(listingId: string, user_id: string): Promise<any> {
	const { error } = await supabase.from('listing_likes').insert({ listing_id: listingId, user_id: user_id })
	if (error) console.log(error)
}

export async function unlikeListing(listingId: string, user_id: string): Promise<any> {
	const { error } = await supabase.from('listing_likes').delete().match({ user_id: user_id, listing_id: listingId })
	if (error) console.log(error)
}
