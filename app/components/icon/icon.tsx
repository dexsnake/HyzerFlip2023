/* eslint-disable react/display-name */
import * as React from 'react'
import { View } from 'react-native'
import { ChevronLeftIcon, LifebuoyIcon, XMarkIcon, EllipsisHorizontalIcon } from 'react-native-heroicons/outline'

export type HeaderIconTypes = keyof typeof icons

const icons = {
	close: <XMarkIcon color="#334155" />,
	back: <ChevronLeftIcon color="#334155" />,
	help: <LifebuoyIcon color="#334155" />,
	ellipsis: <EllipsisHorizontalIcon color="#334155" />
}

export function Icon(props: IconProps) {
	const { icon, className } = props

	return <View className={className}>{icons[icon]}</View>
}

export interface IconProps {
	/**
	 * className overrides for the icon container
	 */

	className?: string

	/**
	 * The name of the icon
	 */

	icon?: string
}
