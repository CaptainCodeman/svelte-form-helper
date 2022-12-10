const forms = require('@tailwindcss/forms')
const plugin = require('tailwindcss/plugin')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
	},

	plugins: [
		forms,
		plugin(({ addVariant }) => {
			addVariant('touched', '&[data-touched]')
		}),
	],
}

module.exports = config
