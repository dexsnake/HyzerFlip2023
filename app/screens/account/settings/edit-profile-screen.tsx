import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Alert, View, Image, Pressable, Text } from 'react-native'
import { Button, Header, Screen, TextField } from '../../../components'
import LoadingOverlay from '../../../components/modals/loading-overlay'
import { AuthContext } from '../../../context/Auth'
import { ProfileContext } from '../../../context/Profile'
import { SettingsStackParamsList } from '../../../navigators/stacks/Settings'
import { supabase } from '../../../clients/supabase'
import { delay } from '../../../utils/delay'
import { decode } from 'base64-arraybuffer'
import ImagePicker, { ImageOrVideo, Image as Iimage } from 'react-native-image-crop-picker'

export const EditProfileScreen: FC<StackScreenProps<SettingsStackParamsList, 'edit-profile-screen'>> = ({ navigation }) => {
	const goBack = () => {
		navigation.goBack()
	}

	const { profile } = useContext(ProfileContext)
	const [image, setImage] = useState<Iimage | string>(profile.image_url)
	const [username, setUsername] = useState(profile?.username)
	const [description, setDescription] = useState(profile?.description)
	const [loading, setLoading] = useState(false)

	// Clean up the Tmp images on first render
	useEffect(() => {
		async function cleanImageTmp() {
			await ImagePicker.clean()
		}
		cleanImageTmp()
	}, [])

	async function openPhotoPicker() {
		try {
			const pickedImage = await ImagePicker.openPicker({
				compressImageMaxWidth: 1000,
				compressImageMaxHeight: 1000,
				mediaType: 'photo',
				forceJpg: true,
				maxFiles: 1
			})
			const cropped = await ImagePicker.openCropper({
				path: pickedImage.path,
				width: 1000,
				height: 1000,
				mediaType: 'photo',
				includeBase64: true
			})
			const arrayBuffer = decode(cropped.data)
			const timeStamp = new Date().toISOString()

			const { data, error: storageError } = await supabase.storage
				.from('avatars')
				.upload(`${profile?.id}.jpg?t=${timeStamp}`, arrayBuffer, { contentType: 'image/jpg', upsert: true })
			if (storageError) throw new Error(storageError.message)

			const { data: url } = supabase.storage.from('avatars').getPublicUrl(data.path)

			const { error: dbError } = await supabase.from('profiles').update({ image_url: url.publicUrl }).eq('id', profile?.id)
			if (dbError) throw new Error(dbError.message)

			setImage(cropped)
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	async function updateProfile() {
		try {
			setLoading(true)
			const { error } = await supabase.from('profiles').update({ username, description }).eq('id', profile?.id)
			if (error && error.code === '23505') throw new Error('That username is already taken')
			if (error) throw new Error(error.message)
			await delay(2000)
			goBack()
		} catch (error) {
			Alert.alert(error.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<View className="flex flex-1">
			<Screen backgroundColor="#fff">
				<Header title="Edit profile" leftIcon="back" onLeftPress={goBack} />
				<View className="px-4 pt-4">
					<View className="mb-2 flex-row items-center gap-6">
						<Image className="h-14 w-14 rounded-full" source={{ uri: typeof image === 'string' ? image : image.path, cache: 'force-cache' }} />
						<Pressable className="bg-gray-100  px-3 py-2" onPress={openPhotoPicker}>
							<Text className="text-gray-800 font-semibold text-xs">Change photo</Text>
						</Pressable>
					</View>
					<TextField
						onChangeText={setUsername}
						label="Username"
						value={username}
						autoCorrect={false}
						keyboardType="default"
						textContentType="username"
						autoCapitalize="none"
						placeholder="A sick username..."
					/>
					<TextField
						onChangeText={setDescription}
						label="Description"
						multiline
						numberOfLines={20}
						className="h-20"
						value={description}
						keyboardType="default"
						autoCapitalize="sentences"
						placeholder="Write a little bit about yourself"
					/>

					<Button onPress={updateProfile} text="Save changes" />
				</View>
			</Screen>
			<LoadingOverlay show={loading} />
		</View>
	)
}
