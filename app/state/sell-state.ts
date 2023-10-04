import { hookstate, ImmutableObject } from '@hookstate/core'
import { Image } from 'react-native-image-crop-picker'
import { Listing } from '../../types'

export type SellStoreValue = ImmutableObject<ImmutableObject<SellState>>
export interface SellState {
	editMode?: boolean
	id?: string
	images: Image[] | string[]
	newImages?: Image[]
	title: string
	description: string
	type: string
	brand: string
	condition: string
	status?: string
	color: string
	ships_from: string
	free_shipping: boolean
	shipping_cost: string
	price: string
}

export const initialSellStoreState: SellState = {
	images: [],
	title: '',
	description: '',
	type: '',
	brand: '',
	condition: '',
	color: '',
	ships_from: '',
	free_shipping: false,
	shipping_cost: '',
	price: ''
}
export const sellStore = hookstate(initialSellStoreState)

export function initStore(listing: Listing) {
	sellStore.set({
		editMode: true,
		id: listing.id,
		images: listing.images,
		newImages: [],
		title: listing.title,
		description: listing.description,
		type: listing.type,
		brand: listing.brand,
		status: listing.status,
		condition: listing.condition,
		color: listing.color,
		ships_from: listing.ships_from,
		free_shipping: listing.free_shipping,
		shipping_cost: listing.shipping_cost.toString(),
		price: listing.price.toString()
	})
}

export function clearStore() {
	sellStore.set({
		images: [],
		title: '',
		description: '',
		type: '',
		brand: '',
		condition: '',
		color: '',
		ships_from: '',
		free_shipping: false,
		shipping_cost: '',
		price: ''
	})
}
