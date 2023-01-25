import { useState, useEffect } from 'react'
import { supabase } from '../clients/supabase'
import { ChatMessage } from '../../types'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'

export default function useMessages(chatId: number) {
	const [messages, setMessages] = useState<IMessage[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function getMessages(chatId: number) {
		try {
			setLoading(true)
			if (!chatId) throw new Error('No chatId provided')
			const { data, error } = await supabase.from('chat_messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: false })
			if (error) {
				throw new Error(error.message)
			}
			setError('')
			const messagesMapped = data.map((m) => ({ _id: m._id, createdAt: new Date(m.created_at), text: m.text, user: m.user }))
			setMessages(messagesMapped)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (chatId) {
			getMessages(chatId)
			const messagesSubscription = supabase
				.channel('chat_messages_channel')
				.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${chatId}` }, (payload) => {
					const message = payload.new as ChatMessage
					const newMessage = [
						{
							createdAt: new Date(message.created_at),
							_id: message._id,
							user: message.user,
							text: message.text
						}
					]
					setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage))
				})
				.subscribe()
			return () => {
				supabase.removeChannel(messagesSubscription)
			}
		} else return undefined
	}, [chatId])

	return { messages, setMessages, loading, error }
}
