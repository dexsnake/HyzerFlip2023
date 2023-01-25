import { createState, useState } from '@hookstate/core'
interface signupStateInterface {
	firstName: string
	lastName: string
	email: string
	username: string
	password1: string
	password2: string
	signupType: 'email' | 'apple' | 'google' | 'facebook'
}

const initialSignupState: signupStateInterface = {
	firstName: 'Grace',
	lastName: 'Candis',
	email: 'grace.candis@gmail.com',
	username: 'gcandis',
	password1: 'test1234',
	password2: 'test1234',
	signupType: 'email'
}
const signupState = createState(initialSignupState)

export const useSignupState = () => {
	const signup = useState(signupState)
	return {
		set: (key: keyof typeof initialSignupState, value: any) => signup[key].set(value),
		get: () => signup.value,
		clear: () => {
			for (const [key] of Object.entries(initialSignupState)) {
				if (key === 'appleCredential') signup[key].set(null)
				else if (key === 'signupType') signup[key].set('email')
				else signup[key].set('')
			}
		}
	}
}
