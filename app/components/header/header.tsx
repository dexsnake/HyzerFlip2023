import React from 'react'
import { View } from 'react-native'
import { HeaderProps } from './header.props'
import { Button } from '../Button'
import { Text } from '../text'
import { Icon } from '../icon/icon'

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
	const { onLeftPress, onRightPress, titleClassName, border = true, className, rightIcon, rightText, leftIcon, leftText, headerText } = props

	return (
		<View className={`flex-row ${border ? 'border-b-gray-300 border-b-line' : ''} item-center px-3 pb-3 justify-between ${className}`}>
			{leftIcon && (
				<Button preset="default" onPress={onLeftPress}>
					<Icon icon={leftIcon} />
				</Button>
			)}
			{leftText && (
				<Button preset="default" onPress={onLeftPress}>
					<Text className="text-gray-700 tracking-wide">{leftText}</Text>
				</Button>
			)}
			{!leftIcon && !leftText ? <View className="w-8"></View> : null}
			<View className="flex-1 justify-center">
				<Text className={`text-center text-gray-700 text-base font-medium tracking-wider ${titleClassName}`} text={headerText} />
			</View>
			{rightIcon && (
				<Button preset="default" onPress={onRightPress}>
					<Icon icon={rightIcon} />
				</Button>
			)}
			{rightText && (
				<Button preset="default" onPress={onRightPress}>
					<Text className="text-gray-700 tracking-wide">{rightText}</Text>
				</Button>
			)}
			{!rightIcon && !rightText ? <View className="w-8"></View> : null}
		</View>
	)
}
