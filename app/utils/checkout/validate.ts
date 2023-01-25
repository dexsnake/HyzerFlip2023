import validate from 'validate.js'
import Toast from 'react-native-toast-message'
import Stripe from 'stripe'

export default function validateCheckout(address: Stripe.Address, payment: Stripe.PaymentMethod, applePay: boolean) {
	const rules = {
		address: {
			presence: { message: '📦 Please add a shipping address', allowEmpty: false }
		},
		payment: !applePay ? { presence: { message: '💳 Please add a payment method', allowEmpty: false } } : null
	}
	const errors = validate({ address, payment }, rules, { fullMessages: false, format: 'flat' })
	if (errors) {
		Toast.show({
			type: 'error',
			position: 'bottom',
			text1: errors[0]
		})
		return true
	} else return false
}
