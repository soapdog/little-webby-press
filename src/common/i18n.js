import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from '../../locales/en.json';
import pt from '../../locales/pt.json';

addMessages('en', en);
addMessages('pt', pt);

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
