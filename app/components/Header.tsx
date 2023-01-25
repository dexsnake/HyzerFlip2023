import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { HeaderIconTypes, Icon } from './icon/icon'

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
	const { onLeftPress, onRightPress, titleClassName, border = true, className, rightIcon, rightText, leftIcon, leftText, title } = props

	return (
		<View className={`flex-row ${border ? 'border-b-gray-300 border-b-line' : ''} item-center px-3 pb-3 justify-between ${className}`}>
			{leftIcon && (
				<Pressable onPress={onLeftPress}>
					<Icon icon={leftIcon} />
				</Pressable>
			)}
			{leftText && (
				<Pressable onPress={onLeftPress}>
					<Text className="text-gray-700 tracking-wide">{leftText}</Text>
				</Pressable>
			)}
			{!leftIcon && !leftText ? <View className="w-8"></View> : null}
			<View className="flex-1 justify-center">
				<Text className={`text-center text-gray-700 text-base font-medium tracking-wider ${titleClassName}`}>{title}</Text>
			</View>
			{rightIcon && (
				<Pressable onPress={onRightPress}>
					<Icon icon={rightIcon} />
				</Pressable>
			)}
			{rightText && (
				<Pressable onPress={onRightPress}>
					<Text className="text-gray-700 tracking-wide">{rightText}</Text>
				</Pressable>
			)}
			{!rightIcon && !rightText ? <View className="w-8"></View> : null}
		</View>
	)
}

export interface HeaderProps {
	/**
	 * header non-i18n
	 */
	title?: string

	/**
	 * Icon that should appear on the left
	 */
	leftIcon?: HeaderIconTypes

	/**
	 * Icon that should appear on the left
	 */
	leftText?: string

	/**
	 * What happens when you press the left icon
	 */
	onLeftPress?(): void

	/**
	 * Icon that should appear on the right
	 */
	rightIcon?: HeaderIconTypes

	/**
	 * Text that should appear on the right
	 */
	rightText?: string

	/**
	 * What happens when you press the right icon
	 */
	onRightPress?(): void

	/**
	 * What happens when you press the right icon
	 */
	border?: boolean
	/**
	 * Title className overrides.
	 */
	titleClassName?: string
	/**
	 * Container className overrides.
	 */
	className?: string
}
