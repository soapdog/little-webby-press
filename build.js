import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";

esbuild
  .build({
    entryPoints: ["src/main.js"],
    conditions: ["svelte", "browser"],
    bundle: true,
    outfile: "/docs2/out.js",
    plugins: [sveltePlugin()],
    logLevel: "error",
  })
  .catch(() => process.exit(1));
