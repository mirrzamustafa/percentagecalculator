import { redirect } from "next/navigation";

export default function CalculatorPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}`);
}
