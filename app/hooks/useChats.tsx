import { useState, useEffect } from 'react'
import { supabase } from '../clients/supabase'
import { Chat, Listing } from '../../types'
import { save } from '../utils/storage'

export interface ChatWithListing extends Chat {
	listing: Listing
}

export default function useChats(profileId: string) {
	const [chats, setChats] = useState<ChatWithListing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [newChat, setNewChat] = useState<ChatWithListing | null>(null)
	const [updatedChat, setUpdatedchat] = useState<Chat | null>(null)

	async function getChats() {
		try {
			setLoading(true)
			const { data, error } = await supabase
				.from('chats')
				.select('*, listing:listings (*)')
				.or(`user_1.eq.${profileId},user_2.eq.${profileId}`)
				.order('updated_at', { ascending: false })
			if (error) throw new Error(error.message)
			// @ts-ignore
			setChats(data)
			await save('chats', data)
			setError('')
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	// Realtime listener for user_1 chats
	useEffect(() => {
		if (profileId) {
			getChats()
			const user1ChatsSubscription = supabase
				.channel('chats_user1_sub')
				.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chats', filter: `user_1=eq.${profileId}` }, (payload) => {
					setUpdatedchat(payload.new as Chat)
				})
				.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats', filter: `user_1=eq.${profileId}` }, (payload) => {
					supabase
						.from('listings')
						.select('*')
						.eq('id', payload.new.listing_id)
						.single()
						.then(({ data }) => {
							setNewChat({ ...payload.new, listing: data } as ChatWithListing)
						})
				})
				.subscribe()
			const user2ChatsSubscription = supabase
				.channel('chats_user2_sub')
				.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chats', filter: `user_2=eq.${profileId}` }, (payload) => {
					setUpdatedchat(payload.new as Chat)
				})
				.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats', filter: `user_2=eq.${profileId}` }, (payload) => {
					supabase
						.from('listings')
						.select('*')
						.eq('id', payload.new.listing_id)
						.single()
						.then(({ data }) => {
							setNewChat({ ...payload.new, listing: data } as ChatWithListing)
						})
				})
				.subscribe()
			return () => {
				supabase.removeChannel(user1ChatsSubscription)
				supabase.removeChannel(user2ChatsSubscription)
			}
		} else return undefined
	}, [profileId])

	// Add new chats to the chats state
	useEffect(() => {
		if (newChat) {
			const chatsCopy = [...chats]
			chatsCopy.unshift(newChat)
			setChats(chatsCopy)
		}
	}, [newChat])

	// Update chat that has new message
	useEffect(() => {
		if (updatedChat) {
			const chatsCopy = [...chats]
			const index = chatsCopy.findIndex((c) => c.id === updatedChat.id)
			chatsCopy[index].updated_at = updatedChat.updated_at
			chatsCopy[index].last_message = updatedChat.last_message
			setChats(chatsCopy)
		}
	}, [updatedChat])

	return { chats, loading, error }
}
