import LegalPage from "@/components/LegalPage";
import { getTranslations } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);
  return {
    title: `${t.ui.privacyPolicy} | ${t.meta.title}`,
    description: t.meta.description,
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  const content = (
    <div className="space-y-8">
      {t.seo.privacy.sections.map((section: any, index: number) => (
        <section key={index}>
          <h3 className="mb-3 uppercase tracking-tight">
            {section.title}
          </h3>
          <p className="leading-relaxed">
            {section.content}
          </p>
        </section>
      ))}
    </div>
  );

  return (
    <LegalPage
      locale={locale}
      title={t.ui.privacyPolicy}
      content={content}
      translations={t}
    />
  );
}