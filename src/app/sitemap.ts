import { MetadataRoute } from "next";
import { supportedLocales } from "@/lib/domainConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = supportedLocales.map((locale) => {
    const domain =
      locale === "en"
        ? "https://percentagecalculator.us"
        : `https://percentagecalculator.${locale}`;

    return {
      url: `${domain}/${locale}`,
      lastModified: new Date(),
    };
  });

  return routes;
}