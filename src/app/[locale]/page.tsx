import CalculatorClient from "@/components/CalculatorClient";
import { getTranslations } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations(params.locale);

  return (
      <CalculatorClient />     
  );
}