import { supportedLocales } from "./domainConfig";

export async function getTranslations(locale: string) {
  if (!supportedLocales.includes(locale)) {
    locale = "en";
  }

  return (await import(`./translations/en.json`)).default;
}