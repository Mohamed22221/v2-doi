/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const safeListFile = 'safelist.txt'

// colors.indigo
const SAFELIST_COLORS = 'colors'

module.exports = {
	mode: 'jit',
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		'./safelist.txt'
	],
	darkMode: 'class',
	theme: {

		fontFamily: {
			sans: [
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'"Noto Sans"',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
				'"Noto Color Emoji"',
			],
			serif: [
				'ui-serif',
				'Georgia',
				'Cambria',
				'"Times New Roman"',
				'Times',
				'serif',
			],
			mono: [
				'ui-monospace',
				'SFMono-Regular',
				'Menlo',
				'Monaco',
				'Consolas',
				'"Liberation Mono"',
				'"Courier New"',
				'monospace',
			],
		},
		screens: {
			xs: '576',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme('colors.gray.500'),
						maxWidth: '65ch',
					},
				},
				invert: {
					css: {
						color: theme('colors.gray.400'),
					},
				},
			}),

			colors: {
				primary: {
					50: '#EDF1F7',
					100: '#DCE3EF',
					200: '#B9C7DF',
					300: '#96ABCF',
					400: '#728FC0',
					500: '#2A3D5D',
					600: '#3F5C8D',
					700: '#304569',
					800: '#202E46',
					900: '#101723',
					1000: '#62748E',
				},
				neutral: {
					10: '#FEFEFE',
					50: '#F2F2F2',
					100: '#E6E6E5',
					200: '#CDCDCB',
					300: '#B3B3B2',
					400: '#9A9A98',
					500: '#292928',
					600: '#676765',
					800: '#343432',
					950: '#0D0D0D',
				},
				green: {
					100: '#ECF9F2',
					200: '#B2E6CA',
					300: '#66CC96',
					400: '#3BBB73',
					500: '#339963',
				},
				yellow: {
					100: '#FDF8E7',
					200: '#F8E2A0',
					300: '#F5D470',
					400: '#F1C541',
					500: '#F2C94C',
				},
				red: {
					100: '#FBE9E9',
					200: '#F1A7A7',
					300: '#E34F4F',
					400: '#E24B4B',
					500: '#B01C1C',
				},
			},
			boxShadow: {
				primary: '0px 2px 8px 0px rgba(42, 61, 93, 0.1)',
				dark: '0px 2px 8px 0px rgba(42, 61, 93, 0.7)',

			},
		},
	},
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		require('./twSafelistGenerator')({
			path: safeListFile,
			patterns: [
				`text-{${SAFELIST_COLORS}}`,
				`bg-{${SAFELIST_COLORS}}`,
				`dark:bg-{${SAFELIST_COLORS}}`,
				`dark:hover:bg-{${SAFELIST_COLORS}}`,
				`dark:active:bg-{${SAFELIST_COLORS}}`,
				`hover:text-{${SAFELIST_COLORS}}`,
				`hover:bg-{${SAFELIST_COLORS}}`,
				`active:bg-{${SAFELIST_COLORS}}`,
				`ring-{${SAFELIST_COLORS}}`,
				`hover:ring-{${SAFELIST_COLORS}}`,
				`focus:ring-{${SAFELIST_COLORS}}`,
				`focus-within:ring-{${SAFELIST_COLORS}}`,
				`border-{${SAFELIST_COLORS}}`,
				`focus:border-{${SAFELIST_COLORS}}`,
				`focus-within:border-{${SAFELIST_COLORS}}`,
				`dark:text-{${SAFELIST_COLORS}}`,
				`dark:hover:text-{${SAFELIST_COLORS}}`,
				`h-{height}`,
				`w-{width}`,
			],
		}),
		require('@tailwindcss/typography'),
	],
};
