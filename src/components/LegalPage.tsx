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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6">
          <div className="flex items-center gap-4 mb-2">
            <a href={`/${locale}`} className="flex items-center gap-4">
              <span className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text} shadow-sm ring-1 ${ACTIVE_THEME.ring}`}>
                <Zap size={20} strokeWidth={2.5} fill="currentColor" className="opacity-20" />
                <Zap size={20} strokeWidth={2.5} className="absolute drop-shadow-sm" />
              </span>
              <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-slate-900 sm:text-2xl">
                {translations.seo.h1}
              </h1>
            </a>
          </div>
          <p className="mt-2 max-w-4xl text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600 sm:text-xs">
            {translations.meta.description}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 sm:px-6">
        <div className="bg-white p-8 sm:p-12 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">{title}</h2>
          <div className="max-w-none text-slate-600 leading-relaxed space-y-6">
            {content}
          </div>
        </div>
      </main>

      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <span className={`h-8 w-8 flex items-center justify-center rounded-lg ${ACTIVE_THEME.footerBg} ${ACTIVE_THEME.footerText} shadow-sm ring-1 ${ACTIVE_THEME.footerRing}`}><Percent size={16} strokeWidth={3} /></span>
            <div>
              <div className="text-base font-bold text-slate-900">{translations.seo.h1}</div>
              <div className="text-xs font-medium text-slate-500">© {currentYear}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href={`/${locale}/privacy`} className={`text-sm font-bold text-slate-600 ${ACTIVE_THEME.linkHover} transition-colors`}>
              {translations.ui.privacyPolicy}
            </a>
            <a href={`/${locale}/terms`} className={`text-sm font-bold text-slate-600 ${ACTIVE_THEME.linkHover} transition-colors`}>
              {translations.ui.termsOfService}
            </a>
            <a href="#" className={`inline-flex items-center gap-2 text-sm font-bold text-slate-600 ${ACTIVE_THEME.linkHover} transition-colors`}>
              <ArrowUp size={16} /> {translations.ui.backToTop}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
