import { PLATFORM_FEE_RATE } from '../constants/Fees'

export function calculatePlatformFee(price: string | number) {
	if (!price) return 0
	if (typeof price === 'string') {
		const priceAsNumber = parseInt(price)
		const fee = priceAsNumber * PLATFORM_FEE_RATE
		return Math.round(fee * 100) / 100
	} else if (typeof price === 'number') {
		const fee = price * PLATFORM_FEE_RATE
		return Math.round(fee * 100) / 100
	} else return 0
}
