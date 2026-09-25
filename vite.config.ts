import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Positions Tool',
				short_name: 'Positions',
				description: 'Record positions',
				display: 'standalone',
				start_url: '/',
				background_color: '#ffffff',
				theme_color: '#ffffff',
				icons: [
					{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
					{
						src: '/pwa-maskable-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
				navigateFallback: '/index.html',
				navigateFallbackDenylist: [/^\/_app\//, /\/api\//]
			},
			devOptions: {
				enabled: false
			}
		}),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({ out: 'build' }),

			typescript: {
				config: (config) => {
					config.include.push('../drizzle.config.ts');
				}
			}
		})
	]
});
