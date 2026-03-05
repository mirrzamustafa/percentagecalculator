import { Metadata } from "next";
import { getTranslations } from "@/lib/i18n";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const locale = "fr";
  const t = await getTranslations(locale);
  const baseUrl = "https://calculerlepourcentage.fr";

  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: baseUrl,
      languages: {
        en: "https://percentagecalculator.us/en",
        fr: "https://calculerlepourcentage.fr/fr",
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
      siteName: "Percentage Calculator",
      images: [
        {
          url: `${baseUrl}/icon.png`,
          width: 512,
          height: 512,
          alt: t.meta.title,
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [`${baseUrl}/icon.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = "fr";
  const t = await getTranslations(locale);

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
    <html lang={locale}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
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
