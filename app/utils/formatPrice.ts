/**
 * Returns a formatted price
 *
 * Takes in a badly formatted price ie: 29.3 or 145 and formats it
 * @param `price`
 * @returns $29.30 or $145.00 as a `string`
 */

export default function formatPrice(price = 0) {
	const options = {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	}

	const formatter = Intl.NumberFormat('en-US', options)

	return formatter.format(price)
}
