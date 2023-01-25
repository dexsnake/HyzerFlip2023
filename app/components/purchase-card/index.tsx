import { NavigationProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { format } from 'date-fns'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import { SaleWithListing } from '../../hooks/usePurchase'
import { ClockIcon, EyeIcon, HeartIcon } from 'react-native-heroicons/outline'

interface Props {
	item: SaleWithListing
	navigation: StackNavigationProp<any> | NavigationProp<any>
	showStatus?: boolean
	single?: boolean
	showSold?: boolean
	showDetailsButton?: boolean
	showFullTime?: boolean
	showViews?: boolean
	showLikes?: boolean
	view: 'buying' | 'selling'
	disabled?: boolean
}

export default function PurchaseCard({
	item,
	navigation,
	view = 'buying',
	showStatus = true,
	single,
	showSold = true,
	showDetailsButton,
	showFullTime,
	showViews,
	showLikes,
	disabled
}: Props) {
	const forBuying = view === 'buying'

	function getOrderStatus() {
		if (item.status === 'awaiting shipping') return forBuying ? 'Awaiting shipping information' : 'Ship the item'
		if (item.status === 'shipped') return forBuying ? "On it's way" : 'Waiting for delivery'
		if (item.status === 'delivered' && !item.buyer_rated_at) return forBuying ? 'Rate the seller' : 'Rate the buyer'
		if (item.status === 'delivered' && item.buyer_rated_at) return forBuying ? 'Rate the seller' : 'Rating requested'
		if (item.status === 'error') return forBuying ? 'Something went wrong' : 'Something went wrong'
		return ''
	}

	const orderStatus = getOrderStatus()

	return (
		<View className={`${!single ? 'border-b-slate-300 border-b-[0.75px] py-3' : 'py-0'}`}>
			<Pressable disabled={disabled} onPress={() => navigation.navigate('order-status', { saleId: item.id, view })}>
				<View className="flex flex-row justify-between items-center">
					<View className="flex flex-row gap-3 items-center">
						<Image source={{ uri: item.listing.images[0], cache: 'force-cache' }} className="h-24 w-24 rounded-md" />

						{showSold && item.listing.status === 'sold' && (
							<View className="absolute top-0 left-0 rounded-tl-md bg-orange-400/80 px-2 py-1">
								<Text className="text-white font-semibold text-xs">SOLD</Text>
							</View>
						)}
						<View>
							{showStatus && item.status !== 'complete' && (
								<View className="bg-slate-100 px-1 rounded self-start">
									<Text className="text-sm text-blue-500">{orderStatus}</Text>
								</View>
							)}
							<Text numberOfLines={1} className="mb-1 text-base font-light">
								{item.listing.title}
							</Text>
							<Text className="font-bold">${item.listing.price}</Text>
							<View className="flex flex-row gap-1 -ml-2">
								<View className="flex flex-row gap-1 items-center mt-1">
									{showFullTime ? <Text className="text-slate-500 text-xs">{forBuying ? 'Purchased' : 'Sold'} on</Text> : <ClockIcon size={16} color="#64748b" />}
									<Text className="text-slate-500 text-xs">{format(new Date(item.listing.created_at), `MM/dd/yyyy${showFullTime ? ' p' : ''}`)}</Text>
								</View>
								{showLikes && (
									<View className="flex flex-row gap-1 items-center mt-1">
										<HeartIcon size={16} color="#64748b" />
										<Text className="text-slate-500 text-xs">{item.listing.likes}</Text>
									</View>
								)}
								{showViews && (
									<View className="flex flex-row gap-1 items-center mt-1">
										<EyeIcon size={16} color="#64748b" />
										<Text className="text-slate-500 text-xs">{item.listing.views}</Text>
									</View>
								)}
							</View>
						</View>
					</View>
					{showDetailsButton && (
						<Pressable onPress={() => navigation.navigate('order-details', { order: item })} className="bg-slate-100 rounded px-3 py-2">
							<Text className="font-semibold">Details</Text>
						</Pressable>
					)}
				</View>
			</Pressable>
		</View>
	)
}
