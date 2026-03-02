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
    title: `${t.ui.privacyPolicy} | ${t.seo.h1}`,
    description: t.meta.description,
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  const content = (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h3>
        <p>We do not collect any personal information from our users. Our percentage calculator is a client-side tool that processes data locally in your browser.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">2. Cookies and Tracking</h3>
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">3. Data Security</h3>
        <p>Since we do not store any user data, your calculations remain private and secure within your own device.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">4. Third-Party Links</h3>
        <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these external websites.</p>
      </section>
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-3">5. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us through our website.</p>
      </section>
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
