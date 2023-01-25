import { useState, useEffect } from 'react'
import { supabase } from '../clients/supabase'
import { Chat, Profile } from '../../types'

export default function useChat(chatId: number, setChatId: (id: number) => void, listingId: string, user1?: Profile, user2?: Profile) {
	const [chat, setChat] = useState<Chat | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	async function getChatById() {
		try {
			setLoading(true)
			const { data, error } = await supabase.from('chats').select('*').eq('id', chatId).single()
			if (error) throw new Error(error.message)
			setChat(data)
			setError('')
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	async function getChatByUsers() {
		try {
			setLoading(true)
			const { data, error } = await supabase
				.from('chats')
				.select('id')
				.eq('listing_id', listingId)
				.in('user_1', [user1.id, user2.id])
				.in('user_2', [user1.id, user2.id])
				.single()
			if (error && error.details.includes('Results contain 0 rows')) return
			else if (error) throw new Error(error.message)
			setChatId(data.id)
			setError('')
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (chatId) getChatById()
		if (!chatId && user1 && user2 && listingId) getChatByUsers()
	}, [chatId, user1, user2, listingId])

	return { chat, loading, error }
}
