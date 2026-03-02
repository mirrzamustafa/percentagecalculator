"use client";

import { usePathname, useRouter } from "next/navigation";
import { supportedLocales } from "@/lib/domainConfig";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split("/");
    if (supportedLocales.includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || "/");
  };

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-slate-400" />
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer hover:text-emerald-600 transition-colors uppercase"
      >
        {supportedLocales.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>
    </div>
  );
}
