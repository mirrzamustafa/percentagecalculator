import { MetadataRoute } from "next";
import { supportedLocales } from "@/lib/domainConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = supportedLocales.map((locale) => {
    const domain =
      locale === "en"
        ? "https://calculerlepourcentage.fr"
        : locale === "fr"
        ? "https://calculerlepourcentage.fr"
        : `https://calculerlepourcentage.fr`;

    const baseUrl = `${domain}/${locale}`;
    return [
      { url: baseUrl, lastModified: new Date() },
      { url: `${baseUrl}/privacy`, lastModified: new Date() },
      { url: `${baseUrl}/terms`, lastModified: new Date() },
    ];
  }).flat();

  return routes;
}