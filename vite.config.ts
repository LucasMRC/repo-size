import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			input: [
				'src/main.ts',
				'src/scripts/background.ts',
				'src/scripts/repo-size.ts',
				'src/scripts/tk.txt',
				'./index.html',
			],
			output: {
				entryFileNames: '[name].js',
				assetFileNames: '[name].[ext]'
			}
		},
	},
	plugins: [svelte(), tailwindcss()]
})
