import { hookstate } from '@hookstate/core'

export interface AddressState {
	name: string
	line1: string
	line2?: string
	city: string
	state: string
	postal_code: string
	country: string
	action: 'add' | 'edit'
}

export const initialAddressStoreState: AddressState = {
	name: '',
	line1: '',
	line2: '',
	city: '',
	state: '',
	postal_code: '',
	country: '',
	action: 'add'
}
export const addressStore = hookstate(initialAddressStoreState)

export function clearAddressStore() {
	addressStore.set({
		name: '',
		line1: '',
		line2: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
		action: 'add'
	})
}
