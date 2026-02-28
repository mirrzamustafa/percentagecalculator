import { Metadata } from "next";
import { getTranslations } from "@/lib/i18n";
import { supportedLocales } from "@/lib/domainConfig";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  const baseUrl = `https://percentagecalculator.${params.locale === "en" ? "us" : params.locale}`;

  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: baseUrl,
      languages: {
        en: "https://percentagecalculator.us/en",
        fr: "https://percentagecalculator.fr/fr",
        it: "https://percentagecalculator.it/it",
        de: "https://percentagecalculator.de/de",
        es: "https://percentagecalculator.es/es",
        "x-default": "https://percentagecalculator.us/en"
      }
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: baseUrl,
      type: "website"
    }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations(params.locale);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.seo.faq.map((item: any) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.meta.title,
    applicationCategory: "CalculatorApplication",
    operatingSystem: "All"
  };

  return (
    <html lang={params.locale}>
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </body>
    </html>
  );
}