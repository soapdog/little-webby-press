<script>
  import { _ } from "svelte-i18n"
  import {currentView} from "./viewManager.js"

</script>

<nav class="py-2 pb-4 text-xl">
  <ul class="flex">
    <li class="mr-6">
      <a class="nav font-semibold" href="#press" on:click={() => {currentView.set("press")}}>
        Little.Webby.Press
      </a>
    </li>
    <li class="mr-6">
      <a class="nav" href="#documentation" on:click={() => {currentView.set("documentation")}}>{$_("nav_help")}</a>
    </li>
    <li class="mr-6">
      <a
        class="nav"
        href="https://github.com/soapdog/little-webby-press"
        target="_blank">
        {$_("nav_github")}
      </a>
    </li>
  </ul>
</nav>
