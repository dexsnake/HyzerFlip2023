import { PROCESSING_FEE_FIXED, PROCESSING_FEE_RATE } from '../constants/Fees'

export function calculateProcessingFee(price: string | number) {
	if (!price) return 0
	if (typeof price === 'string') {
		const priceAsNumber = parseInt(price)
		const firstFee = priceAsNumber * PROCESSING_FEE_RATE
		const secondFee = firstFee + PROCESSING_FEE_FIXED
		return Math.round(secondFee * 100) / 100
	} else if (typeof price === 'number') {
		const firstFee = price * PROCESSING_FEE_RATE
		const secondFee = firstFee + PROCESSING_FEE_FIXED
		return Math.round(secondFee * 100) / 100
	} else return 0
}
