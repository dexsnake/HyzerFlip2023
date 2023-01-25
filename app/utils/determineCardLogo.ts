const mastercard = require('../../assets/images/credit-cards/mastercard.png')
const visa = require('../../assets/images/credit-cards/visa.png')
const amex = require('../../assets/images/credit-cards/amex.png')
const discover = require('../../assets/images/credit-cards/discover.png')

export default function determineCardLogo(cardBrand: string) {
	if (cardBrand === 'mastercard') return mastercard
	if (cardBrand === 'visa') return visa
	if (cardBrand === 'amex') return amex
	if (cardBrand === 'discover') return discover
}
