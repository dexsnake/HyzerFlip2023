/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				flip: {
					502: '#E5ECFC',
					100: '#2563EB',
					200: '#1D4DB7'
				}
			},
			borderWidth: {
				3: '3px',
				line: '0.75px'
			}
		}
	},
	plugins: []
}
