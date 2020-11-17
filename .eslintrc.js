module.exports = {
    parserOptions: {
      ecmaVersion: 2019,
      sourceType: 'module'
    },
    extends: "eslint:recommended",
    env: {
      es6: true,
      browser: true
    },
    plugins: [
      'svelte3'
    ],
    overrides: [
      {
        files: ['*.svelte'],
        processor: 'svelte3/svelte3'
      }
		],
		rules: {
			quotes: ["error", "double"]
		}
  };
