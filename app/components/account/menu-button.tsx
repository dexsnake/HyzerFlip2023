import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Cog6ToothIcon, InformationCircleIcon, QuestionMarkCircleIcon, ShoppingCartIcon, TagIcon, UserIcon } from 'react-native-heroicons/outline'

interface Props {
	icon?: keyof typeof icons
	text: string
	onPress: () => void
	highlight?: boolean
}

export default function MenuButton({ icon, text, onPress, highlight }: Props) {
	return (
		<Pressable onPress={onPress} className={`py-4 px-2 border-b-line border-b-gray-300`}>
			<View className="flex-row items-center">
				{icon && <Icon icon={icon} />}
				<Text className={`ml-3 text-base ${highlight ? 'text-flip-100 font-semibold' : 'text-gray-700 font-normal'}`}>{text}</Text>
			</View>
		</Pressable>
	)
}

const icons = {
	user: <UserIcon color="#6b7280" size={20} />,
	info: <InformationCircleIcon color="#6b7280" size={20} />,
	cart: <ShoppingCartIcon color="#6b7280" size={20} />,
	tag: <TagIcon color="#6b7280" size={20} />,
	question: <QuestionMarkCircleIcon color="#6b7280" size={20} />,
	settings: <Cog6ToothIcon color="#6b7280" size={20} />
}

export function Icon({ icon }: { icon: keyof typeof icons }) {
	return <View>{icons[icon]}</View>
}
