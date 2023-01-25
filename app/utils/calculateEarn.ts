import { calculateProcessingFee } from './calculateProcessingFee'
import { calculatePlatformFee } from './calculatePlatformFee'

export function calculateEarn(price: string | number, shipping?: string | number) {
	if (!price) return 0
	let priceAsNumber: number
	let shippingAsNumber = 0
	if (typeof price === 'string') priceAsNumber = parseInt(price)
	if (typeof price === 'number') priceAsNumber = price
	if (shipping && typeof shipping === 'string') shippingAsNumber = parseInt(shipping)
	if (shipping && typeof shipping === 'number') shippingAsNumber = shipping
	const total = priceAsNumber - calculateProcessingFee(price) - calculatePlatformFee(price) + shippingAsNumber
	return Math.round(total * 100) / 100
}
