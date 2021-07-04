import App from './App.svelte';
import { initializeFilesystem } from "./common/fs.js";
import {currentView} from "./common/viewManager.js"
import "./common/i18n.js"

let app;

if (location.hash.length > 0) {
  currentView.set(location.hash.slice(1))
}

initializeFilesystem()
	.then(bfs => {
		app = new App({
			target: document.body,
		});
	})

export default app;
