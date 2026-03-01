import CalculatorClient from "@/components/CalculatorClient";
import { getTranslations } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <CalculatorClient locale={locale} translations={t} />
  );
}