import React from 'react'
import { Image, Pressable, Text } from 'react-native'
import { ArrowRightOnRectangleIcon, EnvelopeIcon } from 'react-native-heroicons/outline'
import { SigninButtonProps } from './signin-button.props'
const googleLogo = require('./google-logo.png')

export function SigninButton(props: SigninButtonProps) {
	const { brand, type } = props

	function determineBrandName(brandName: 'apple' | 'google' | 'facebook' | 'email') {
		if (brandName === 'apple') return 'Apple'
		if (brandName === 'google') return 'Google'
		if (brandName === 'facebook') return 'Facebook'
		else return 'Email'
	}

	function determineBrandLogo(brandName: 'apple' | 'google' | 'facebook' | 'email') {
		if (brandName === 'apple') return <ArrowRightOnRectangleIcon />
		if (brandName === 'google') return <Image source={googleLogo} />
		if (brandName === 'facebook') return <ArrowRightOnRectangleIcon />
		else return <EnvelopeIcon />
	}

	const brandName = determineBrandName(brand)
	const brandLogo = determineBrandLogo(brand)

	return (
		<Pressable className="w-full h-12 bg-white flex-row items-center justify-center rounded">
			{brandLogo}
			<Text className="text-gray-800 py-3">
				{type === 'signup' ? 'Sign up' : 'Log in'} with {brandName}
			</Text>
		</Pressable>
	)
}
