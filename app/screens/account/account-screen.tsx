import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext } from 'react'
import { Alert, View, ViewStyle } from 'react-native'
import { Button, Header, Screen } from '../../components'
import ProfileStats from '../../components/account/profile-stats'
import ProfileHeader from '../../components/account/settings/profile-header'
import { AccountStackParamsList } from '../../navigators/stacks/Account'
import { openBrowserAsync } from 'expo-web-browser'
import MenuButton from '../../components/account/menu-button'
import Badges from '../../components/account/badges'
import { supabase } from '../../clients/supabase'
import { ProfileContext } from '../../context/Profile'
import { api } from '../../services/api'
import Stripe from 'stripe'
import { observer } from 'mobx-react-lite'

export const AccountScreen: FC<StackScreenProps<AccountStackParamsList, 'account-screen'>> = observer(({ navigation }) => {
	const { clearProfile, profile } = useContext(ProfileContext)

	// Button Actions
	const openHowItWorksLink = () => openBrowserAsync('http://172.30.0.177:3000/how-it-works')
	const openHelpCenterLink = () => openBrowserAsync('http://172.30.0.177:3000/help-center')
	const goToSettings = () => navigation.navigate('settings-stack-screen')
	const goToSelling = () => navigation.navigate('selling')
	const goToBuying = () => navigation.navigate('buying')
	const goToStripeInit = () => navigation.navigate('stripe-init', { from: 'account' })

	const BUTTON_CONTAINER: ViewStyle = { marginBottom: 30 }

	async function testing() {
		const { data: loginLink } = await api.apisauce.get<Stripe.LoginLink>(`/stripe/login-link/${profile.merchant_id}`)

		await openBrowserAsync(loginLink.url)
	}

	function handleSignOut() {
		Alert.alert('Log out', 'Are you sure you want to log out?', [
			{ text: 'No' },
			{
				text: 'Yes',
				onPress: () => {
					supabase.auth.signOut()
					clearProfile()
					navigation.navigate('home-stack')
				}
			}
		])
	}

	return (
		<View className="flex-1">
			<Screen statusBarStyle="dark" preset="scroll">
				<Header rightIcon="help" border={false} onRightPress={openHelpCenterLink} />
				<ProfileHeader navigation={navigation} />
				<ProfileStats />
				<View style={BUTTON_CONTAINER}>
					{!profile?.setup_complete && <MenuButton highlight text="Complete account setup" icon="user" onPress={goToStripeInit} />}
					<MenuButton text="How Hyzer Flip Works" icon="info" onPress={openHowItWorksLink} />
					<MenuButton text="Selling" icon="tag" onPress={goToSelling} />
					<MenuButton text="Buying" icon="cart" onPress={goToBuying} />
					<MenuButton text="Help Center" icon="question" onPress={openHelpCenterLink} />
					<MenuButton text="Settings" icon="settings" onPress={goToSettings} />
				</View>
				<View style={BUTTON_CONTAINER}>
					<Badges />
				</View>
				<Button text="Logout" onPress={handleSignOut} />
				<View className="mt-3">
					<Button text="Account info" onPress={testing} />
				</View>
			</Screen>
		</View>
	)
})
