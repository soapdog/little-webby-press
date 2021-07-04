<script>
	import Nav from "./common/Nav.svelte"
	import Press from "./press/Press.svelte"
  import {currentView} from "./common/viewManager.js"

  const views = {
    press: Press
  }
</script>

<div class="w-1/3 ml-auto mr-auto h-12">
	<Nav />
	<svelte:component this={views[$currentView]}  />
</div>
