import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ne'],
  defaultLocale: 'ne',
  localeDetection: true
});

export const config = {
  matcher: ['/', '/(en|ne)/:path*']
};
