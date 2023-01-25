import { PressableProps } from 'react-native'

export interface SigninButtonProps extends PressableProps {
	/**
	 * Determins what logo and brand name will be display on the button
	 */
	brand: 'apple' | 'google' | 'facebook' | 'email'
	/**
	 * Determins whether 'Signin with ...' or 'Log in with...' will be displayed on the button
	 */
	type: 'signup' | 'login'
}
