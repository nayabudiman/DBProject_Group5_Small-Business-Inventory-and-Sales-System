// UBAH DARI: import adapter from '@sveltejs/adapter-auto';
// MENJADI:
import adapter from '@sveltejs/adapter-node'; // <--- INI

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // adapter-node akan membuat folder 'build' yang siap dijalankan
        adapter: adapter()
    }
};

export default config;