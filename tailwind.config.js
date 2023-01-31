/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		screens: {
			mobile: '360px',
			desktop: '640px',
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
