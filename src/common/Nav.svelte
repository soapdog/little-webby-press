<script>
  import { _ } from "svelte-i18n"
</script>

<nav class="py-2 pb-4 text-xl">
  <ul class="flex">
    <li class="mr-6">
      <a class="nav font-semibold" href="/">
        Little.Webby.Press
      </a>
    </li>
    <li class="mr-6">
      <a class="nav" href="/documentation/en">{$_("nav_help")}</a>
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
