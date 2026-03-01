import CalculatorClient from "@/components/CalculatorClient";
import { getTranslations } from "@/lib/i18n";

export default async function RootPage() {
  const locale = "fr";
  const t = await getTranslations(locale);

  return (
    <CalculatorClient locale={locale} translations={t} />
  );
}
