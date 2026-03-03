"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Zap, Percent } from "lucide-react";

const THEMES = {
  blue: {
    primary: "blue",
    bg: "bg-blue-100",
    text: "text-blue-700",
    ring: "ring-blue-200",
    focus: "focus:ring-blue-500/20",
    resultBg: "bg-blue-50/50",
    resultText: "text-blue-800",
    resultRing: "ring-blue-100",
    resultBorder: "border-blue-200/40",
    accentText: "text-blue-600",
    percentText: "text-blue-300",
    footerBg: "bg-blue-100",
    footerText: "text-blue-700",
    footerRing: "ring-blue-200",
    hoverShadow: "hover:shadow-blue-50/50",
    linkHover: "hover:text-blue-600"
  }
};

const ACTIVE_THEME = THEMES.blue;

interface Props {
  locale: string;
  title: string;
  content: React.ReactNode;
  translations: any;
}

export default function LegalPage({ locale, title, content, translations }: Props) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans overflow-x-hidden">
      <header className="border-b-4 border-blue-500 bg-white py-4 shadow-md sticky top-0 z-50 -mx-4 sm:-mx-6 mb-10">
        <a href={`/${locale}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded shadow-lg shrink-0">
              <Percent size={24} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase leading-none">
                {locale === 'fr' ? "Calculer Le Pourcentage" : translations.ui?.headerTitle || "Calculate Percentage"}
              </h1>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-tight mt-1 leading-tight">
                {translations.seo?.headline || "Percentage Calculator is a free online tool to calculate percentages."}
              </span>
            </div>
          </div>
        </div>
        </a>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 sm:px-6">
        <div className="bg-white p-8 sm:p-12 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{title}</h2>
          <div className="max-w-none text-slate-600 leading-relaxed space-y-6">
            {content}
          </div>
        </div>
      </main>


      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
           <p className="text-sm font-bold uppercase tracking-widest mb-6">&copy; {currentYear} {translations.seo.h1.split(' ')[0]} Calc</p>
           <div className="flex justify-center gap-10 text-xs font-bold uppercase">
              <a href={`/${locale}/privacy`} className="hover:text-white transition-colors">{translations.ui.privacyPolicy}</a>
              <a href={`/${locale}/terms`} className="hover:text-white transition-colors">{translations.ui.termsOfService}</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
