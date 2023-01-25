import { supabase } from '../../clients/supabase'

export async function isListingAvailable(id: string): Promise<boolean> {
	const { data, error } = await supabase.from('listings').select('status').eq('id', id).single()
	if (error) return false
	if (data.status === 'sold') return false
	else return true
}
