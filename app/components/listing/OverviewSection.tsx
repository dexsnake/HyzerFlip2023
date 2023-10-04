import React from 'react'
import { ActionSheetIOS, Pressable, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Listing } from '../../../types'
import discConditions from '../../constants/DiscConditions'
import { ArrowRightOnRectangleIcon, FlagIcon } from 'react-native-heroicons/outline'
import useAuth from '../../hooks/useAuth'

interface Props {
	item: Listing
}

export default function OverviewSection({ item }: Props) {
	const { session } = useAuth()

	const CONTAINER: ViewStyle = { backgroundColor: '#fff', paddingHorizontal: 16, marginTop: 10 }
	const SECTION: ViewStyle = { borderBottomColor: '#d1d5db', borderBottomWidth: 0.75 }
	const NO_BORDER_BOTTOM: ViewStyle = { borderBottomWidth: 0 }
	const SECTION_TITLE: TextStyle = { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 20, color: '#d1d5db' }
	const DETAIL_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: 15 }
	const DETAIL_NAME: TextStyle = { color: 'gray', width: 90 }
	const DETAIL_TEXT: TextStyle = { color: '#374151', width: 220 }
	const DESCRIPTION_TEXT: TextStyle = { marginBottom: 20, color: '#d1d5db' }
	const TAG_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', marginBottom: 20 }
	const TAG_WRAPPER: ViewStyle = { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 30, marginRight: 15 }
	const TAG_TEXT: TextStyle = { color: '#d1d5db' }
	const ACTION_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }
	const ACTION_BUTTON: ViewStyle = { display: 'flex', flexDirection: 'row', alignItems: 'center' }
	const ACTION_BUTTON_TEXT: TextStyle = { color: '#d1d5db', marginTop: 4, fontWeight: '500', marginLeft: 4 }

	function handleShare() {
		ActionSheetIOS.showShareActionSheetWithOptions(
			{
				message: 'Share this profile',
				url: 'http://172.30.0.177:3000'
			},
			() => console.log('error'),
			() => console.log('success')
		)
	}

	return (
		<View style={CONTAINER}>
			<View style={SECTION}>
				<Text style={SECTION_TITLE}>Overview</Text>
				<View style={DETAIL_CONTAINER}>
					<Text style={DETAIL_NAME}>Disc Type</Text>
					<Text style={DETAIL_TEXT}>{item.type}</Text>
				</View>
				<View style={DETAIL_CONTAINER}>
					<Text style={DETAIL_NAME}>Brand</Text>
					<Text style={DETAIL_TEXT}>{item.brand}</Text>
				</View>
				<View style={DETAIL_CONTAINER}>
					<Text style={DETAIL_NAME}>Condition</Text>
					<Text style={DETAIL_TEXT}>
						{item.condition} - {discConditions[discConditions.length - parseInt(item.condition)].description}
					</Text>
				</View>
			</View>
			<View style={SECTION}>
				<Text style={SECTION_TITLE}>Description</Text>
				<Text style={DESCRIPTION_TEXT}>{item.description}</Text>
			</View>
			{item.tags && item.tags.length > 0 && (
				<View style={SECTION}>
					<Text style={SECTION_TITLE}>Tags</Text>
					<View style={TAG_CONTAINER}>
						{item.tags.map((tag) => {
							return (
								<View key={tag} style={TAG_WRAPPER}>
									<Text style={TAG_TEXT}>#{tag}</Text>
								</View>
							)
						})}
					</View>
				</View>
			)}
			<View style={[SECTION, NO_BORDER_BOTTOM]}>
				<View style={ACTION_CONTAINER}>
					<Pressable onPress={handleShare} style={ACTION_BUTTON}>
						<ArrowRightOnRectangleIcon size={22} />
						<Text style={ACTION_BUTTON_TEXT}>Share</Text>
					</Pressable>
					{session?.user.id !== item.user_id && (
						<Pressable style={ACTION_BUTTON}>
							<FlagIcon size={22} />
							<Text style={ACTION_BUTTON_TEXT}>Report</Text>
						</Pressable>
					)}
				</View>
			</View>
		</View>
	)
}
