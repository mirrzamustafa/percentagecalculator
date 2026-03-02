import LegalPage from "@/components/LegalPage";
import { getTranslations } from "@/lib/i18n";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale);
  return {
    title: `${t.ui.termsOfService} | ${t.seo.h1}`,
    description: t.meta.description,
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  const content = (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h3>
        <p>By using our percentage calculator, you agree to these Terms of Service. If you do not agree, please do not use our website.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">2. Use of Service</h3>
        <p>Our calculator is provided for informational purposes only. We strive for accuracy but cannot guarantee that all calculations are error-free.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">3. Intellectual Property</h3>
        <p>The design, code, and content of this website are protected by copyright laws. You may not reproduce or distribute any part of our site without permission.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">4. Limitation of Liability</h3>
        <p>We are not liable for any damages or losses resulting from the use of our calculator or reliance on its results.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">5. Changes to Terms</h3>
        <p>We reserve the right to update these terms at any time. Your continued use of the site constitutes acceptance of the modified terms.</p>
      </section>
    </div>
  );

  return (
    <LegalPage
      locale={locale}
      title={t.ui.termsOfService}
      content={content}
      translations={t}
    />
  );
}
