import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { TxKeyPath } from '../../i18n'

export interface HeaderProps {
	/**
	 * header non-i18n
	 */
	headerText?: string

	/**
	 * Icon that should appear on the left
	 */
	leftIcon?: string

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
	rightIcon?: string

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
	 * Container style overrides.
	 */
	style?: StyleProp<ViewStyle>

	/**
	 * Title style overrides.
	 */
	titleStyle?: StyleProp<TextStyle>
	/**
	 * Title className overrides.
	 */
	titleClassName?: string
	/**
	 * Container className overrides.
	 */
	className?: string
}
