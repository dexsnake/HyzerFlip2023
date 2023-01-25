/* eslint-disable @typescript-eslint/ban-ts-comment */
import { initAccountSetup } from './initAccountSetup'
const GOOGLE_WEB_CLIENT_ID = '50598081620-alanmok7m02uq751okht0aa1dte7hjqs.apps.googleusercontent.com'

export interface GoogleFullName {
	givenName: string
	familyName: string
}

export async function continueWithGoogle() {
	try {
		// GoogleSignin.configure({
		// 	webClientId: GOOGLE_WEB_CLIENT_ID
		// })
		// // Get the users ID token
		// const { idToken, user: googleUser } = await GoogleSignin.signIn()
		// // Create a Google credential with the token
		// const googleCredential = googleProvider.credential(idToken)
		// // Signin with appleCredential
		// const { user, additionalUserInfo } = await auth.signInWithCredential(googleCredential)
		// // Check if the user is a new user
		// const isNewUser = additionalUserInfo.isNewUser
		// // If user is new user, add a setup_complete equal to false custom claim to user object
		// if (isNewUser) await initAccountSetup(user.uid, user.email, { givenName: googleUser.givenName, familyName: googleUser.familyName })
		// return { isNewUser, fullName: { givenName: googleUser.givenName, familyName: googleUser.familyName }, email: googleUser.email }
	} catch (error: any) {
		throw new Error(error.message)
	}
}
