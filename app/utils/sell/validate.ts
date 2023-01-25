import { SellState } from '../../state/sell-state'
import validate from 'validate.js'
import Toast from 'react-native-toast-message'

export default function validateStore(store: Partial<SellState>) {
	const rules = {
		images: {
			presence: { message: '📸 Please include atleast one image', allowEmpty: false }
		},
		title: {
			presence: { message: "Looks like you're missing a title", allowEmpty: false },
			length: {
				minimum: 8,
				maximum: 80,
				tooShort: 'Title must be at least 8 characters',
				tooLong: 'Title must be less than 80 characters'
			}
		},
		description: {
			presence: { message: "Looks like you're missing a description", allowEmpty: false },
			length: {
				minimum: 20,
				maximum: 1000,
				tooShort: 'Description must be at least 20 characters',
				tooLong: 'Description must be less than 1000 characters'
			}
		},
		type: {
			presence: { message: "Looks like you're missing a disc type", allowEmpty: false }
		},
		brand: {
			presence: { message: "Looks like you're missing a brand", allowEmpty: false }
		},
		condition: {
			presence: { message: "Looks like you're missing the condition", allowEmpty: false }
		},
		color: {
			presence: { message: "Looks like you're missing the color", allowEmpty: false }
		},
		ships_from: {
			presence: { message: "Looks like you're missing your zip code", allowEmpty: false }
		},
		shipping_cost: store.free_shipping ? {} : { presence: { message: "Looks like you're missing the shipping cost", allowEmpty: false } },
		price: {
			presence: { message: "Looks like you're missing the price", allowEmpty: false }
		}
	}
	const errors = validate({ ...store }, rules, { fullMessages: false, format: 'flat' })
	if (errors) {
		Toast.show({
			type: 'error',
			position: 'bottom',
			text1: errors[0]
		})
		return true
	} else return false
}
