import React, { useState, useEffect, createContext, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../clients/supabase'
import OneSignal from 'react-native-onesignal'
interface AuthContextInterface {
	session: Session | null
}

interface Props {
	children: ReactNode
}

export const AuthContext = createContext<AuthContextInterface>({ session: null })

export const AuthProvider = ({ children }: Props) => {
	const [session, setSession] = useState<Session | null>(null)

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session)
		})
		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
		})
	}, [])

	useEffect(() => {
		if (session) {
			OneSignal.setEmail(session.user.email, undefined, () => {
				OneSignal.setExternalUserId(session.user.id)
			})
		}
	}, [session])

	return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
}
