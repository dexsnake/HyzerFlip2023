import { supabase } from '../../clients/supabase'

export async function updateListing(id: string, fields: Record<string, unknown>): Promise<void> {
	try {
		const { error } = await supabase
			.from('listings')
			.update({ ...fields })
			.eq('id', id)
		if (error) throw new Error(error.message)
	} catch (error) {
		throw new Error(error.message)
	}
}
