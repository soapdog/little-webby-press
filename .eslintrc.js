module.exports = {
    parserOptions: {
      ecmaVersion: 2019,
      sourceType: "module"
    },
		extends: "eslint:recommended",
    env: {
      es6: true,
      browser: true
		},
		globals: {
			Handlebars: "writable",
			module: "writable",
			require: "writable",
			JSZip: "writable",
      Asciidoctor: "writable"
		},
    plugins: [
      "svelte3"
    ],
    overrides: [
      {
        files: ["*.svelte"],
        processor: "svelte3/svelte3"
      }
		],
		rules: {
			quotes: ["error", "double"],
			"no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
		}
  };
