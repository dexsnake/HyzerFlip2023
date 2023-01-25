import validate from 'validate.js'
import Toast from 'react-native-toast-message'
import { AddressState } from '../../state/address-state'

export default function validateAddress(store: Partial<AddressState>, addresses: boolean[]) {
	const rules = {
		name: {
			presence: { message: 'Last name cannot be blank', allowEmpty: false }
		},
		line1: {
			presence: { message: 'Address 1 cannot be blank', allowEmpty: false }
		},
		city: {
			presence: { message: 'City cannot be blank', allowEmpty: false }
		},
		state: {
			presence: { message: 'State cannot be blank', allowEmpty: false }
		},
		postal_code: {
			presence: { message: 'Zip code cannot be blank', allowEmpty: false },
			length: { message: 'Zip code must be 5 digits', is: 5 }
		},
		addresses: {
			presence: { message: 'Please select address type', allowEmpty: false }
		}
	}
	const errors = validate({ ...store, addresses }, rules, { fullMessages: false, format: 'flat' })
	if (errors) {
		Toast.show({
			type: 'error',
			position: 'bottom',
			text1: errors[0]
		})
		return true
	} else return false
}
