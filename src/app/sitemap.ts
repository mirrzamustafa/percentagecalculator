import { MetadataRoute } from "next";
import { supportedLocales } from "@/lib/domainConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = supportedLocales.map((locale) => {
    const domain =
      locale === "en"
        ? "https://percentagecalculator.us"
        : `https://percentagecalculator.${locale}`;

    const baseUrl = `${domain}/${locale}`;
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/privacy`, lastModified: new Date() },
      { url: `${baseUrl}/terms`, lastModified: new Date() },
    ];
  }).flat();

  return routes;
}