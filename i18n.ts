import {getRequestConfig} from 'next-intl/server';

export const locales = ['en', 'ne'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ne';

export default getRequestConfig(async ({locale}) => {
  // Normalize and ensure supported locale
  const l: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: l,
    messages: (await import(`./messages/${l}.json`)).default
  };
});
