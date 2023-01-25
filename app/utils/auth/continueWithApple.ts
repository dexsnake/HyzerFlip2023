/* eslint-disable @typescript-eslint/ban-ts-comment */
import { initAccountSetup } from './initAccountSetup'

export async function continueWithApple() {
	try {
		throw new Error('')
	} catch (error) {
		throw new Error(error.message)
	}

	// // Start the sign-in request
	// const appleAuthRequestResponse = await appleAuth.performRequest({
	// 	requestedOperation: appleAuth.Operation.LOGIN,
	// 	requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
	// })

	// // Ensure Apple returned a user identityToken
	// if (!appleAuthRequestResponse.identityToken) {
	// 	throw new Error('Apple Sign-In failed - no identify token returned')
	// } else {
	// 	// destructure items from the appleAuthResponse
	// 	const { identityToken, nonce, email, fullName } = appleAuthRequestResponse

	// 	// Create a Firebase credential from the response
	// 	const appleCredential = appleProvider.credential(identityToken, nonce)

	// 	// Signin with appleCredential
	// 	const { user, additionalUserInfo } = await auth.signInWithCredential(appleCredential)

	// 	// Check if the user is a new user
	// 	const isNewUser = additionalUserInfo.isNewUser

	// 	// If user is new user, add a setup_complete equal to false custom claim to user object
	// 	if (isNewUser) initAccountSetup(user.uid, email, fullName)

	// 	// @ts-ignore
	// 	return { isNewUser, email, fullName }
}
