import type { Config } from 'tailwindcss'

export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
	darkMode: "class",
	theme: {
		extend: {
			aspectRatio: {
				auto: 'auto',
				square: '1 / 1',
				video: '16 / 9'
			},
			colors: {
				"primary-color": { // see app.config.ts
					'50': '#e8eefd',
					'100': '#bacdf6',
					'200': '#8eabee',
					'300': '#6488e5',
					'400': '#3c63d9',
					'500': '#2a4fd3',
					'600': '#2242BF',
					'700': '#18309E',
					'800': '#0F2280',
					'900': '#08155E',
					'950': '#040B3D'
				},
				'gray-color': { // see app.config.ts
					50: "#fafafd",
					100: "#f0f0f0",
					200: "#dcdcde",
					300: "#AFB0B3",
					400: "#74757B",
					500: "#363840",
					600: "#303238",
					700: "#2a2a30",
					800: "#141417",
					900: "#111114",
					950: "#0b0b0d",
				}
			}
		}
	}
} satisfies Config
