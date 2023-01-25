import React, { useEffect } from 'react'
import { TextStyle, View, Text, ViewStyle, Pressable, Image as RNImage, ImageStyle, ActionSheetIOS } from 'react-native'
import ImagePicker, { ImageOrVideo, Image } from 'react-native-image-crop-picker'
import { sellStore } from '../../state/sell-state'
import { useState } from '@hookstate/core'
import { CameraIcon } from 'react-native-heroicons/outline'

export default function ImageSelection() {
	const [containerWidth, setContainerWidth] = React.useState(0)
	const { images, editMode, newImages } = useState(sellStore)
	const [editIndex, setEditIndex] = React.useState(-1)

	const MAX_IMAGES = 4

	const PLACEHOLDER_CONTAINER: ViewStyle = { display: 'flex', flexDirection: 'row', marginHorizontal: -8 }
	const IMAGE_CONTAINER: ViewStyle = { position: 'relative', padding: 5, height: containerWidth / 4, width: containerWidth / 4 }
	const IMAGE_PLACEHOLDER: ViewStyle = { backgroundColor: '#fff', height: '100%', width: '100%', borderRadius: 3 }
	const IMAGE_PLACEHOLDER_BUTTON: ViewStyle = { ...IMAGE_PLACEHOLDER, display: 'flex', justifyContent: 'center', alignItems: 'center' }
	const IMAGE_PREVIEW: ImageStyle = { width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 3 }
	const IMAGE_PLACEHOLDER_BUTTON_CONTAINER: ViewStyle = { display: 'flex', alignItems: 'center' }
	const REQUIRED: TextStyle = { fontSize: 9, color: '#2563EB', textAlign: 'center' }
	const EDIT_BUTTON: ViewStyle = {
		position: 'absolute',
		bottom: 5,
		right: 5,
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		borderBottomRightRadius: 3,
		borderTopLeftRadius: 3,
		paddingVertical: 2,
		paddingHorizontal: 3
	}
	const EDIT_BUTTON_TEXT: TextStyle = { fontSize: 12, color: '#fff' }

	// Clean up the Tmp images on first render
	useEffect(() => {
		async function cleanImageTmp() {
			await ImagePicker.clean()
		}
		cleanImageTmp()
	}, [])

	async function cropImages(images: ImageOrVideo[]) {
		try {
			// Declare an empty array to put images in
			const croppedImages: Image[] = []
			// Loop through each image and open the cropper
			for (const image of images) {
				const cropped = await ImagePicker.openCropper({
					path: image.path,
					width: 1000,
					height: 1000,
					mediaType: 'photo',
					includeBase64: true
				})
				croppedImages.push(cropped)
			}
			return croppedImages
		} catch (error) {
			throw error.message
		}
	}

	async function openPhotoPicker() {
		try {
			const pickedImages = await ImagePicker.openPicker({
				compressImageMaxWidth: 1000,
				compressImageMaxHeight: 1000,
				multiple: true,
				mediaType: 'photo',
				forceJpg: true,
				maxFiles: MAX_IMAGES - images.length || MAX_IMAGES
			})
			const res = await cropImages(pickedImages)
			if (!editMode.value) {
				if (images.length > 0) images.merge(res)
				else images.set(res)
			} else {
				if (newImages.length > 0) newImages.merge(res)
				else newImages.set(res)
			}
		} catch (error) {
			console.log(error.message)
		}
	}

	const ImagePlaceholder = () => (
		<View style={IMAGE_CONTAINER}>
			<View style={IMAGE_PLACEHOLDER}></View>
		</View>
	)

	function openEditModal(index: number) {
		setEditIndex(index)
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ['Cancel', 'Delete'],
				destructiveButtonIndex: 1,
				cancelButtonIndex: 0
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					// cancel action
				} else if (buttonIndex === 1) {
					deleteImage()
				}
			}
		)
	}

	function deleteImage() {
		// Make a copy of the images state
		const imagesStateCopy = [...images.value]
		// Remove one item from the array at the index selected
		imagesStateCopy.splice(editIndex, 1)
		// Set the state with the new array
		images.set((i) => {
			i.splice(editIndex, 1)
			return i
		})
	}

	return (
		<View>
			<View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} style={PLACEHOLDER_CONTAINER}>
				{images.value.map((image, index) => {
					if (editMode.value) {
						return (
							<Pressable
								key={image}
								onPress={() => {
									openEditModal(index)
								}}
							>
								<View style={IMAGE_CONTAINER}>
									<RNImage source={{ uri: image }} style={IMAGE_PREVIEW} />
									<View style={EDIT_BUTTON}>
										<Text style={EDIT_BUTTON_TEXT}>Edit</Text>
									</View>
								</View>
							</Pressable>
						)
					} else {
						return (
							<Pressable
								key={image.path}
								onPress={() => {
									openEditModal(index)
								}}
							>
								<View style={IMAGE_CONTAINER}>
									<RNImage source={{ uri: image.path }} style={IMAGE_PREVIEW} />
									<View style={EDIT_BUTTON}>
										<Text style={EDIT_BUTTON_TEXT}>Edit</Text>
									</View>
								</View>
							</Pressable>
						)
					}
				})}
				{newImages.length > 0 &&
					newImages.value.map((image, index) => {
						return (
							<Pressable
								key={image.path}
								onPress={() => {
									openEditModal(index)
								}}
							>
								<View style={IMAGE_CONTAINER}>
									<RNImage source={{ uri: image.path }} style={IMAGE_PREVIEW} />
									<View style={EDIT_BUTTON}>
										<Text style={EDIT_BUTTON_TEXT}>Edit</Text>
									</View>
								</View>
							</Pressable>
						)
					})}
				<Pressable style={IMAGE_CONTAINER} onPress={openPhotoPicker}>
					<View style={IMAGE_PLACEHOLDER_BUTTON}>
						<View style={IMAGE_PLACEHOLDER_BUTTON_CONTAINER}>
							<CameraIcon size={30} />
							<Text style={REQUIRED}>{images ? 'Add up to 4 photos' : 'Required'}</Text>
						</View>
					</View>
				</Pressable>
				<ImagePlaceholder />
				<ImagePlaceholder />
				<ImagePlaceholder />
			</View>
		</View>
	)
}
