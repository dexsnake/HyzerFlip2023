import { StackScreenProps } from '@react-navigation/stack'
import { observer } from 'mobx-react-lite'
import React, { FC, useContext, useState, useEffect } from 'react'
import { Text, View, Image } from 'react-native'
import { Button, Screen } from '../../components'
import { AuthStackParamsList } from '../../navigators/stacks/Auth'
import { useSignupState } from '../../state/signup-state'
import { dismissBrowser, openBrowserAsync } from 'expo-web-browser'
import axios from 'axios'
import { ProfileContext } from '../../context/Profile'
import { supabase } from '../../clients/supabase'
import { EyeSlashIcon, LinkIcon } from 'react-native-heroicons/outline'
import LoadingOverlay from '../../components/modals/loading-overlay'
import useAuth from '../../hooks/useAuth'

const stripe = require('../../../assets/images/stripe.png')
const API_BASE_URL = 'http://172.30.0.177:3000/api'

export const StripeInitScreen: FC<StackScreenProps<AuthStackParamsList, 'stripe-init'>> = observer(({ navigation, route }) => {
	const { session } = useAuth()
	const { profile } = useContext(ProfileContext)
	const goBack = () => navigation.goBack()
	const goHome = () => navigation.navigate('home')
	const [loading, setLoading] = useState(false)

	const { get, clear } = useSignupState()

	const { firstName, lastName, email } = get()

	async function handleSignup() {
		try {
			setLoading(true)
			const stripeAccount = await axios.post(`${API_BASE_URL}/stripe/account/create`, {
				email: email,
				firstName: firstName,
				lastName: lastName,
				uid: session.user.id
			})
			const accountId = stripeAccount.data.id
			await supabase.from('profiles').update({ merchant_id: accountId }).match({ id: session.user.id })
			const accountLink = await axios.post(`${API_BASE_URL}/stripe/account-link/${accountId}`, {
				uid: session.user.id,
				type: 'onboard'
			})

			await openBrowserAsync(accountLink.data)
			route.params.from === 'account' ? goBack() : goHome()
		} catch (error: any) {
			console.log(error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (profile?.setup_complete) {
			dismissBrowser()
			clear()
		}
	}, [profile])

	return (
		<View className="flex-1">
			<Screen preset="scroll" backgroundColor="#fff">
				<View className="flex flex-1 pb-12">
					<View className="px-4 mb-10">
						<View className="flex flex-row justify-center">
							<Image className="h-48 w-48" resizeMode="contain" source={stripe} />
						</View>
						<View className="mb-6">
							<Text className="text-2xl text-center font-light">
								Hyzer Flip partners with <Text className="font-semibold">Stripe</Text> for secure payments
							</Text>
						</View>
						<View className="flex flex-row gap-2 mb-6">
							<LinkIcon color="#374151" size={18} />
							<View className="flex-shrink">
								<Text className="font-semibold mb-3 text-base">Connect effortlessly</Text>
								<Text className="">Stripe lets your securly connect your financial accounts in seconds</Text>
							</View>
						</View>
						<View className="flex flex-row gap-2">
							<EyeSlashIcon color="#374151" size={18} />
							<View className="flex-shrink">
								<Text className="font-semibold mb-3 text-base">Your data belongs to you</Text>
								<Text className="">Stripe doesn't sell personal info, and will only use it with your permission</Text>
							</View>
						</View>
					</View>
					<View className="mt-auto flex flex-row justify-center pt-6 px-10 border-t-[0.75px] border-t-gray-200">
						<View className="w-full">
							<Text className="text-gray-500 text-xs text-center mb-4">
								By selecting "Continue" you agree to the{' '}
								<Text onPress={() => openBrowserAsync('https://stripe.com/legal/connect-account')} className="underline font-semibold">
									Stripe Connect Account Agreement
								</Text>{' '}
								and{' '}
								<Text onPress={() => openBrowserAsync('https://stripe.com/privacy')} className="underline font-semibold">
									Stripe Privacy Policy
								</Text>
							</Text>
							<Button preset="filled" onPress={handleSignup}>
								<Text className="text-white text-base font-medium">Continue</Text>
							</Button>
							<View className="flex flex-row justify-center mt-6">
								<Button preset="default" onPress={route.params.from === 'account' ? goBack : goHome} text="Setup later" />
							</View>
						</View>
					</View>
				</View>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
})
