import { Locales } from '@/i18n/i18n-types';
import { detectLocale } from '@/i18n/i18n-util';
import { Request } from 'express';
import {
  initAcceptLanguageHeaderDetector,
  initDocumentCookieDetector,
  initRequestCookiesDetector,
  initRequestParametersDetector,
} from 'typesafe-i18n/detectors';

export const getPreferredLocale = (req: Request): Locales => {
  const requestParametersDetector = initRequestParametersDetector(req, 'locale');
  const cookiesDetector = initRequestCookiesDetector(req, 'locale');

  const body = initDocumentCookieDetector('lang');

  const headers = { get: (key: string) => (req.headers[key] as string) || null };

  const acceptLanguageDetector = initAcceptLanguageHeaderDetector({ headers }, 'locale');

  const locale = detectLocale(requestParametersDetector, acceptLanguageDetector, cookiesDetector, body);

  return locale;
};
