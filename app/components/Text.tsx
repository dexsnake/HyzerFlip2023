import i18n from 'i18n-js'
import React from 'react'
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { isRTL, translate, TxKeyPath } from '../i18n'
import { typography } from '../theme'

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets = keyof typeof $presets

export interface TextProps extends RNTextProps {
	/**
	 * Text which is looked up via i18n.
	 */
	tx?: TxKeyPath
	/**
	 * The text to display if not using `tx` or nested components.
	 */
	text?: string
	/**
	 * Optional options to pass to i18n. Useful for interpolation
	 * as well as explicitly setting locale or translation fallbacks.
	 */
	txOptions?: i18n.TranslateOptions
	/**
	 * An optional style override useful for padding & margin.
	 */
	style?: StyleProp<TextStyle>
	/**
	 * An optional className override useful for padding & margin.
	 */
	className?: string
	/**
	 * One of the different types of text presets.
	 */
	preset?: Presets
	/**
	 * Text weight modifier.
	 */
	weight?: Weights
	/**
	 * Text size modifier.
	 */
	size?: Sizes
	/**
	 * Children components.
	 */
	children?: React.ReactNode
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Text.md)
 */
export function Text(props: TextProps) {
	const { weight, size, tx, txOptions, text, children, style: $styleOverride, className, ...rest } = props

	const i18nText = tx && translate(tx, txOptions)
	const content = i18nText || text || children

	const preset: Presets = $presets[props.preset] ? props.preset : 'default'
	const $styles = [$rtlStyle, $presets[preset], $fontWeightStyles[weight], $sizeStyles[size], $styleOverride]

	return (
		<RNText {...rest} className={twMerge('text-gray-800 text-base font-normal', className)} style={$styles}>
			{content}
		</RNText>
	)
}

const $sizeStyles = {
	xxl: { fontSize: 36, lineHeight: 44 } as TextStyle,
	xl: { fontSize: 24, lineHeight: 34 } as TextStyle,
	lg: { fontSize: 20, lineHeight: 32 } as TextStyle,
	md: { fontSize: 18, lineHeight: 26 } as TextStyle,
	sm: { fontSize: 16, lineHeight: 24 } as TextStyle,
	xs: { fontSize: 14, lineHeight: 21 } as TextStyle,
	xxs: { fontSize: 12, lineHeight: 18 } as TextStyle
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
	return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: StyleProp<TextStyle> = []

const $presets = {
	default: $baseStyle,

	bold: [$baseStyle, $fontWeightStyles.bold] as StyleProp<TextStyle>,

	heading: [$baseStyle, $sizeStyles.xxl, $fontWeightStyles.bold] as StyleProp<TextStyle>,

	subheading: [$baseStyle, $sizeStyles.lg, $fontWeightStyles.medium] as StyleProp<TextStyle>,

	formLabel: [$baseStyle, $fontWeightStyles.medium] as StyleProp<TextStyle>,

	formHelper: [$baseStyle, $sizeStyles.sm, $fontWeightStyles.normal] as StyleProp<TextStyle>
}

const $rtlStyle: TextStyle = isRTL ? { writingDirection: 'rtl' } : {}
