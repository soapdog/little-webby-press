import App from './App.svelte';
import { initializeFilesystem } from "./press/utils.js";

let app;

initializeFilesystem()
	.then(bfs => {
		app = new App({
			target: document.body,
		});
	})

export default app;