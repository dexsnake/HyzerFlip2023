/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import './i18n'
import './utils/ignoreWarnings'
import { useFonts } from 'expo-font'
import React from 'react'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import { AppNavigator, useNavigationPersistence } from './navigators'
import { ErrorBoundary } from './screens/ErrorScreen/ErrorBoundary'
import * as storage from './utils/storage'
import { customFontsToLoad } from './theme'
import { setupReactotron } from './services/reactotron'
import Config from './config'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from './context/Auth'
import { StripeProvider } from '@stripe/stripe-react-native'
import { ProfileProvider } from './context/Profile'

// Set up Reactotron, which is a free desktop app for inspecting and debugging
// React Native apps. Learn more here: https://github.com/infinitered/reactotron
setupReactotron({
	// clear the Reactotron window when the app loads/reloads
	clearOnLoad: true,
	// generally going to be localhost
	host: 'localhost',
	// Reactotron can monitor AsyncStorage for you
	useAsyncStorage: true,
	// log the initial restored state from AsyncStorage
	logInitialState: true,
	// log out any snapshots as they happen (this is useful for debugging but slow)
	logSnapshots: false
})

export const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE'

// Web linking configuration
const prefix = Linking.createURL('/')
const config = {
	screens: {
		Login: {
			path: ''
		},
		Welcome: 'welcome',
		Demo: {
			screens: {
				DemoShowroom: {
					path: 'showroom/:queryIndex?/:itemIndex?'
				},
				DemoDebug: 'debug',
				DemoPodcastList: 'podcast',
				DemoCommunity: 'community'
			}
		}
	}
}

interface AppProps {
	hideSplashScreen: () => Promise<void>
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
	const { hideSplashScreen } = props
	const { initialNavigationState, onNavigationStateChange, isRestored: isNavigationStateRestored } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

	const [areFontsLoaded] = useFonts(customFontsToLoad)

	// const { rehydrated } = useInitialRootStore(() => {
	// This runs after the root store has been initialized and rehydrated.

	// If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
	// Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
	// Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
	// Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
	setTimeout(hideSplashScreen, 500)
	// })

	// Before we show the app, we have to wait for our state to be ready.
	// In the meantime, don't render anything. This will be the background
	// color set in native by rootView's background color.
	// In iOS: application:didFinishLaunchingWithOptions:
	// In Android: https://stackoverflow.com/a/45838109/204044
	// You can replace with your own loading component if you wish.
	if (!isNavigationStateRestored || !areFontsLoaded) return null

	const linking = {
		prefixes: [prefix],
		config
	}

	// otherwise, we're ready to render the app
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider initialMetrics={initialWindowMetrics}>
				<ErrorBoundary catchErrors={Config.catchErrors}>
					<AuthProvider>
						<ProfileProvider>
							<StripeProvider
								publishableKey="pk_test_51I3DRQLWxRWmKsskvcBvXCbJj0Uymk2YSvxVrTESQ38vAelHkg2ZHYgRrSBRe1vKo0KIL42nrl3pVNrnAygQIBRz005W3wBHJE"
								merchantIdentifier="merchant.com.hyzerflip.app"
							>
								<AppNavigator linking={linking} initialState={initialNavigationState} onStateChange={onNavigationStateChange} />
							</StripeProvider>
						</ProfileProvider>
					</AuthProvider>
				</ErrorBoundary>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

export default App
