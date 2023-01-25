import React, { useState, useEffect, createContext, ReactNode, useContext } from 'react'
import { supabase } from '../clients/supabase'
import { AuthContext } from './Auth'
import { Profile, Listing } from '../../types'
import { Alert } from 'react-native'
import { SaleWithListing } from '../hooks/usePurchase'

interface ProfileContextInterface {
	profile: Profile | null
	likes: Listing[]
	sales: SaleWithListing[]
	purchases: SaleWithListing[]
	clearProfile: () => void
}

interface Props {
	children: ReactNode
}

export const ProfileContext = createContext<ProfileContextInterface>({ profile: null, likes: [], sales: [], purchases: [], clearProfile: () => null })

export const ProfileProvider = ({ children }: Props) => {
	const { session } = useContext(AuthContext)
	const [profile, setProfile] = useState<Profile | null>(null)
	const [likes, setLikes] = useState<Listing[]>([])
	const [sales, setSales] = useState<SaleWithListing[]>([])
	const [purchases, setPurchases] = useState<SaleWithListing[]>([])

	async function getProfile() {
		try {
			if (!session.user) throw new Error('No user on the session')
			const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
			if (error && error.details.includes('Results contain 0 rows')) return
			else if (error) throw new Error(error.message)
			// @ts-ignore
			setProfile(data)
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message)
			}
		}
	}

	function clearProfile() {
		setProfile(null)
		setLikes([])
	}

	useEffect(() => {
		if (session) {
			getProfile()
			const profileSubscription = supabase
				.channel('profile_channel')
				.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` }, (payload) => {
					setProfile(payload.new as Profile)
					console.log('profile set')
				})
				.subscribe()
			return () => {
				supabase.removeChannel(profileSubscription)
			}
		} else return undefined
	}, [session])

	useEffect(() => {
		async function getLikes() {
			try {
				const { data, error } = await supabase.from('listing_likes').select('listing:listings (*)').eq('user_id', profile.id)
				if (error && error.details.includes('Results contain 0 rows')) return
				else if (error) throw new Error(error.message)
				// @ts-ignore
				setLikes(data.map(({ listing }) => ({ ...listing })))
			} catch (error) {
				Alert.alert(error.message)
			}
		}
		if (profile) {
			getLikes()
			const likesSubscription = supabase
				.channel('liked_listings_channel')
				.on('postgres_changes', { event: '*', schema: 'public', table: 'listing_likes', filter: `user_id=eq.${profile.id}` }, (payload) => {
					getLikes()
				})
				.subscribe()
			return () => {
				supabase.removeChannel(likesSubscription)
			}
		} else return undefined
	}, [profile])

	return <ProfileContext.Provider value={{ profile, likes, sales, purchases, clearProfile }}>{children}</ProfileContext.Provider>
}
