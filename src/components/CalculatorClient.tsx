// app/CalculatorClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdSlot from "@/components/AdSlot";
import {
  Percent,
  ArrowUp,
  Zap
} from "lucide-react";

const THEMES = {
  emerald: {
    primary: "emerald",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    focus: "focus:ring-emerald-500/20",
    resultBg: "bg-emerald-50/50",
    resultText: "text-emerald-800",
    resultRing: "ring-emerald-100",
    resultBorder: "border-emerald-200/40",
    accentText: "text-emerald-600",
    percentText: "text-emerald-300",
    footerBg: "bg-emerald-100",
    footerText: "text-emerald-700",
    footerRing: "ring-emerald-200",
    hoverShadow: "hover:shadow-emerald-50/50",
    linkHover: "hover:text-emerald-600"
  },
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

const ACTIVE_THEME = THEMES.blue; // Universal theme selection point

type UiHints = {
  nothingToCopy: string;
  copied: string;
  copyFailed: string;
  enterValueAndTotal: string;
  totalCannotBeZero: string;
  done: string;
  enterBaseAndChange: string;
  increase: string;
  decrease: string;
  noChange: string;
  enterOldAndNew: string;
  oldCannotBeZero: string;
};

type CardTranslation = {
  title: string;
  formula: string;
  formulaDescription: string;
  labelValue?: string;
  labelTotal?: string;
  labelResult: string;
  labelBase?: string;
  labelChange?: string;
  labelOld?: string;
  labelNew?: string;
};

type Translations = {
  meta: { title: string; description: string };
  seo: {
    h1: string;
    intro: string;
    howTo: {
      title: string;
      content: string;
      formula: string;
      example: string;
    };
    situations: {
      title: string;
      content: string;
      items: string[];
    };
    examples: {
      title: string;
      items: { title: string; content: string }[];
    };
    formulas: {
      title: string;
      content: string;
      items: { label: string; value: string }[];
    };
    whyUs: {
      title: string;
      items: string[];
    };
    faq: { question: string; answer: string }[];
  };
  ui: {
    isEqual: string;
    calculate: string;
    backToTop: string;
    privacyPolicy: string;
    termsOfService: string;
    cardA: CardTranslation;
    cardB: CardTranslation;
    cardC: CardTranslation;
    cardD: CardTranslation;
    hints: UiHints;
  };
};

interface Props {
  locale: string;
  translations: Translations;
  adClient?: string;
  adSlotTop?: string;
  adSlotMid?: string;
  adSlotBottom?: string;
}

export default function CalculatorClient({
  locale,
  translations,
  adClient = "ca-pub-XXXXXXXXXXXXXXXX",
  adSlotTop = "1111111111",
  adSlotMid = "2222222222",
  adSlotBottom = "3333333333"
}: Props) {

  const h = translations.ui.hints;

  const [calcA, setCalcA] = useState({ percent: "", total: "", result: "", hint: "", tone: "" });
  const [calcB, setCalcB] = useState({ value: "", total: "", result: "", hint: "", tone: "" });
  const [calcC, setCalcC] = useState({ base: "", percent: "", result: "", hint: "", tone: "" });
  const [calcD, setCalcD] = useState({ old: "", new: "", result: "", hint: "", tone: "" });

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);

  const num = (v: string) => {
    const cleaned = v.replace(/,/g, "").trim();
    return cleaned === "" ? NaN : Number(cleaned);
  };

  const roundSmart = (value: number) => {
    if (!isFinite(value)) return "";
    const abs = Math.abs(value);
    const d = abs >= 1000 ? 2 : abs >= 1 ? 4 : 6;
    return String(Number(value.toFixed(d)));
  };

  const handleCalcA = useCallback(() => {
    const p = num(calcA.percent);
    const t = num(calcA.total);
    if (!isFinite(p) || !isFinite(t)) {
      setCalcA(prev => ({ ...prev, result: "", hint: "", tone: "" }));
      return;
    }
    setCalcA(prev => ({ ...prev, result: roundSmart((p / 100) * t), hint: h.done, tone: "ok" }));
  }, [calcA.percent, calcA.total, h.done]);

  const handleCalcB = useCallback(() => {
    const v = num(calcB.value);
    const t = num(calcB.total);
    if (!isFinite(v) || !isFinite(t)) {
      setCalcB(prev => ({ ...prev, result: "", hint: "", tone: "" }));
      return;
    }
    if (t === 0) {
      setCalcB(prev => ({ ...prev, result: "", hint: h.totalCannotBeZero, tone: "warn" }));
      return;
    }
    setCalcB(prev => ({ ...prev, result: roundSmart((v / t) * 100), hint: h.done, tone: "ok" }));
  }, [calcB.value, calcB.total, h.done, h.totalCannotBeZero]);

  const handleCalcC = useCallback(() => {
    const base = num(calcC.base);
    const p = num(calcC.percent);
    if (!isFinite(base) || !isFinite(p)) {
      setCalcC(prev => ({ ...prev, result: "", hint: "", tone: "" }));
      return;
    }
    const res = base * (1 + p / 100);
    setCalcC(prev => ({
      ...prev,
      result: roundSmart(res),
      hint: p > 0 ? h.increase : p < 0 ? h.decrease : h.noChange,
      tone: "ok"
    }));
  }, [calcC.base, calcC.percent, h.increase, h.decrease, h.noChange]);

  const handleCalcD = useCallback(() => {
    const oldV = num(calcD.old);
    const newV = num(calcD.new);
    if (!isFinite(oldV) || !isFinite(newV)) {
      setCalcD(prev => ({ ...prev, result: "", hint: "", tone: "" }));
      return;
    }
    if (oldV === 0) {
      setCalcD(prev => ({ ...prev, result: "", hint: h.oldCannotBeZero, tone: "warn" }));
      return;
    }
    const val = ((newV - oldV) / oldV) * 100;
    setCalcD(prev => ({
      ...prev,
      result: roundSmart(val),
      hint: val > 0 ? h.increase : val < 0 ? h.decrease : h.noChange,
      tone: "ok"
    }));
  }, [calcD.old, calcD.new, h.increase, h.decrease, h.noChange, h.oldCannotBeZero]);

  useEffect(() => { handleCalcA(); }, [handleCalcA]);
  useEffect(() => { handleCalcB(); }, [handleCalcB]);
  useEffect(() => { handleCalcC(); }, [handleCalcC]);
  useEffect(() => { handleCalcD(); }, [handleCalcD]);

  const getHintClass = (tone: string) => {
    if (tone === "ok") return ACTIVE_THEME.accentText;
    if (tone === "warn") return "text-amber-600";
    return "text-slate-500";
  };

  const { cardA, cardB, cardC, cardD } = translations.ui;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans overflow-x-hidden">

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6">
          <div className="flex items-center gap-4 mb-2">
            <span className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text} shadow-sm ring-1 ${ACTIVE_THEME.ring}`}>
              <Zap size={20} strokeWidth={2.5} fill="currentColor" className="opacity-20" />
              <Zap size={20} strokeWidth={2.5} className="absolute drop-shadow-sm" />
            </span>
            <h1 className="text-xl font-bold uppercase tracking-[0.2em] text-slate-900 sm:text-2xl">
              {translations.seo.h1}
            </h1>
          </div>
          <p className="mt-2 max-w-4xl text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-600 sm:text-xs">
            {translations.meta.description}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 sm:px-6 overflow-x-hidden">
        <h2 className="sr-only">{translations.seo.intro}</h2>

        <AdSlot adClient={adClient} adSlot={adSlotTop} adFormat="horizontal" className="my-4" />

        <div id="calculators" className="mt-2 flex flex-col gap-5 sm:gap-6">
        
          {/* Card A */}
          <section className={`group mx-auto w-full max-w-3xl rounded-none bg-white p-4 sm:p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl ${ACTIVE_THEME.hoverShadow} overflow-hidden flex flex-col items-start text-left sm:items-center sm:text-center`}>

            {/* Header */}
            <div className="flex flex-col items-start sm:items-center gap-1 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                {cardA.title}
              </h3>
              <p className={`text-sm font-medium ${ACTIVE_THEME.accentText} italic`}>
                {cardA.formula}
              </p>
            </div>

            {/* Inline calculator */}
            <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 gap-y-4">

              <span className="text-sm font-semibold text-slate-700 sm:text-lg">
                {cardA.labelValue}
              </span>

              <input
                type="number"
                value={calcA.percent}
                onChange={(e) =>
                  setCalcA({ ...calcA, percent: e.target.value })
                }
                placeholder="10"
                className={`w-20 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                          ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                          outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                          sm:w-24 sm:px-3 sm:py-2.5 sm:text-lg`}
              />

              <span className={`h-8 w-8 flex items-center justify-center rounded-xl ${ACTIVE_THEME.text} sm:h-10 sm:w-10`}>
                <Percent size={18} strokeWidth={2.5} className="sm:hidden" />
                <Percent size={20} strokeWidth={2.5} className="hidden sm:block" />
              </span>

              <span className="text-sm font-semibold text-slate-700 sm:text-lg">
                {cardA.labelTotal}
              </span>

              <input
                type="number"
                value={calcA.total}
                onChange={(e) =>
                  setCalcA({ ...calcA, total: e.target.value })
                }
                placeholder="1000"
                className={`w-24 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                          ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                          outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                          sm:w-28 sm:px-3 sm:py-2.5 sm:text-lg`}
              />

              <span className="text-sm font-bold text-slate-500 sm:text-lg">{translations.ui.isEqual}</span>

              <input
                readOnly
                value={calcA.result}
                placeholder="—"
                className={`w-28 rounded-none ${ACTIVE_THEME.resultBg} px-2 py-2 text-sm font-bold ${ACTIVE_THEME.resultText}
                          shadow-sm ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                          border ${ACTIVE_THEME.resultBorder} sm:w-32 sm:px-3 sm:py-2.5 sm:text-lg`}
              />
            </div>
          </section>


          {/* Card B */}
          <section className={`group mx-auto w-full max-w-3xl rounded-none bg-white p-4 sm:p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl ${ACTIVE_THEME.hoverShadow} overflow-hidden flex flex-col items-start text-left sm:items-center sm:text-center`}>

            {/* Header */}
            <div className="flex flex-col items-start sm:items-center gap-1 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                {cardB.title}
              </h3>
              <p className={`text-sm font-medium ${ACTIVE_THEME.accentText} italic`}>
                {cardB.formula}
              </p>
            </div>
            
            {/* Inline calculator */}
            <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 gap-y-4">

              <input
                type="number"
                value={calcB.value}
                onChange={(e) =>
                  setCalcB({ ...calcB, value: e.target.value })
                }
                placeholder="50"
                className={`w-20 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                          ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                          outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                          sm:w-24 sm:px-3 sm:py-2.5 sm:text-lg`}
              />

              <span className="text-sm font-semibold text-slate-700 sm:text-lg">
                {cardB.labelTotal}
              </span>

              <input
                type="number"
                value={calcB.total}
                onChange={(e) =>
                  setCalcB({ ...calcB, total: e.target.value })
                }
                placeholder="1000"
                className={`w-24 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                          ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                          outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                          sm:w-28 sm:px-3 sm:py-2.5 sm:text-lg`}
              />

              <span className="text-sm font-bold text-slate-500 sm:text-lg">{translations.ui.isEqual}</span>

              <div className="relative">
                <input
                  readOnly
                  value={calcB.result}
                  placeholder="—"
                  className={`w-28 rounded-none ${ACTIVE_THEME.resultBg} px-2 py-2 text-sm font-bold ${ACTIVE_THEME.resultText}
                            shadow-sm ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                            border ${ACTIVE_THEME.resultBorder} sm:w-32 sm:px-3 sm:py-2.5 sm:text-lg`}
                />
                <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold ${ACTIVE_THEME.percentText} sm:right-3 sm:text-lg`}>
                  %
                </span>
              </div>

            </div>
          </section>
          {/* Ad 2 */}
          <div className="md:col-span-2 my-1">
            <AdSlot
              adClient={adClient}
              adSlot={adSlotMid}
              adFormat="auto"
              className="my-0"
            />
          </div>
          
{/* Card D */}
<section
  id="calc-d"
  className={`group mx-auto w-full max-w-3xl rounded-none bg-white p-4 sm:p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl ${ACTIVE_THEME.hoverShadow} overflow-hidden flex flex-col items-start text-left sm:items-center sm:text-center`}
>
  {/* Header (STACKED) */}
  <div className="flex flex-col items-start sm:items-center gap-1 mb-6">
    <h3 className="text-lg font-semibold text-slate-800 leading-tight">
      {cardD.title}
    </h3>
    <p className={`text-sm font-medium ${ACTIVE_THEME.accentText} italic`}>
      {cardD.formula}
    </p>
  </div>

  {/* Inline Calculator (MATCHES CARD A) */}
  <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 gap-y-4">

    <span className="text-sm font-semibold text-slate-700 sm:text-lg">
      {cardD.labelOld}
    </span>

    <input
      type="number"
      value={calcD.old}
      onChange={(e) => setCalcD({ ...calcD, old: e.target.value })}
      placeholder="1000"
      className={`w-24 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                 ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                 outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                 sm:w-28 sm:px-3 sm:py-2.5 sm:text-lg`}
    />

    <span className="text-sm font-semibold text-slate-700 sm:text-lg">
      {cardD.labelNew}
    </span>

    <input
      type="number"
      value={calcD.new}
      onChange={(e) => setCalcD({ ...calcD, new: e.target.value })}
      placeholder="1200"
      className={`w-24 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                 ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                 outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                 sm:w-28 sm:px-3 sm:py-2.5 sm:text-lg`}
    />

    <span className="text-sm font-bold text-slate-500 sm:text-lg">{translations.ui.isEqual}</span>

    <div className="relative">
      <input
        readOnly
        value={calcD.result}
        placeholder="—"
        className={`w-28 rounded-none ${ACTIVE_THEME.resultBg} px-2 py-2 text-sm font-bold ${ACTIVE_THEME.resultText}
                   shadow-sm ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                   border ${ACTIVE_THEME.resultBorder} sm:w-32 sm:px-3 sm:py-2.5 sm:text-lg`}
      />
      <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold ${ACTIVE_THEME.percentText} sm:right-3 sm:text-lg`}>
        %
      </span>
    </div>

  </div>
</section>
        {/* Card C */}
        <section
          id="calc-c"
          className={`group mx-auto w-full max-w-3xl rounded-none bg-white p-4 sm:p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl ${ACTIVE_THEME.hoverShadow} overflow-hidden flex flex-col items-start text-left sm:items-center sm:text-center`}
        >
          {/* Header (STACKED like Card A system) */}
          <div className="flex flex-col items-start sm:items-center gap-1 mb-6">
            <h3 className="text-lg font-semibold text-slate-800 leading-tight">
              {cardC.title}
            </h3>
            <p className={`text-sm font-medium ${ACTIVE_THEME.accentText} italic`}>
              {cardC.formula}
            </p>
          </div>

          {/* Inline Calculator (MATCHES CARD A STYLE) */}
          <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 sm:gap-3 gap-y-4">

            <span className="text-sm font-semibold text-slate-700 sm:text-lg">
              {cardC.labelBase}
            </span>

            <input
              type="number"
              value={calcC.base}
              onChange={(e) => setCalcC({ ...calcC, base: e.target.value })}
              placeholder="1000"
              className={`w-24 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                        ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                        outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                        sm:w-28 sm:px-3 sm:py-2.5 sm:text-lg`}
            />

            <span className="text-sm font-semibold text-slate-700 sm:text-lg">
              {cardC.labelChange}
            </span>

            <div className="relative">
              <input
                type="number"
                value={calcC.percent}
                onChange={(e) => setCalcC({ ...calcC, percent: e.target.value })}
                placeholder="10"
                className={`w-20 rounded-none bg-white px-2 py-2 text-sm font-semibold text-slate-800
                          ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                          outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                          sm:w-24 sm:px-3 sm:py-2.5 sm:text-lg`}
              />
              <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-300 sm:right-3 sm:text-lg`}>
                %
              </span>
            </div>

            <span className="text-sm font-bold text-slate-500 sm:text-lg">{translations.ui.isEqual}</span>

            <input
              readOnly
              value={calcC.result}
              placeholder="—"
              className={`w-28 rounded-none ${ACTIVE_THEME.resultBg} px-2 py-2 text-sm font-bold ${ACTIVE_THEME.resultText}
                        shadow-sm ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                        border ${ACTIVE_THEME.resultBorder} sm:w-32 sm:px-3 sm:py-2.5 sm:text-lg`}
            />

          </div>
        </section>
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 space-y-12 border-t border-slate-200 pt-16">
          
          {/* Intro & How To */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {translations.seo.h1}
              </h2>
              <p className="text-lg leading-relaxed text-slate-600">
                {translations.seo.intro}
              </p>
            </div>
            
            <div className={`rounded-none bg-white p-6 shadow-md ring-1 ring-slate-200`}>
              <h3 className="mb-4 text-xl font-bold text-slate-800">
                {translations.seo.howTo.title}
              </h3>
              <p className="mb-4 text-slate-600">{translations.seo.howTo.content}</p>
              <div className={`mb-4 rounded-none ${ACTIVE_THEME.bg} p-4 text-center font-mono text-lg font-bold ${ACTIVE_THEME.text}`}>
                {translations.seo.howTo.formula}
              </div>
              <p className="text-sm italic text-slate-500">{translations.seo.howTo.example}</p>
            </div>
          </div>

          {/* Situations & Why Us */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">{translations.seo.situations.title}</h3>
              <p className="text-slate-600">{translations.seo.situations.content}</p>
              <ul className="space-y-2">
                {translations.seo.situations.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${ACTIVE_THEME.bg}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">{translations.seo.whyUs.title}</h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {translations.seo.whyUs.items.map((item, i) => (
                  <li key={i} className={`rounded-none border border-slate-100 bg-white p-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-${ACTIVE_THEME.primary}-200`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">{translations.seo.examples.title}</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {translations.seo.examples.items.map((item, i) => (
                <div key={i} className="rounded-none border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className={`mb-2 font-bold ${ACTIVE_THEME.accentText}`}>{item.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Formulas */}
          <div className={`rounded-none ${ACTIVE_THEME.bg} p-8 text-center sm:p-12`}>
            <h3 className={`mb-8 text-2xl font-bold ${ACTIVE_THEME.text}`}>
              {translations.seo.formulas.title}
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              {translations.seo.formulas.items.map((item, i) => (
                <div key={i} className="space-y-3">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </span>
                  <div className="rounded-none bg-white p-4 font-mono text-xl font-bold text-slate-800 shadow-sm">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-slate-600">{translations.seo.formulas.content}</p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">FAQ – {translations.ui.calculate}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {translations.seo.faq.map((item, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-bold text-slate-800">Q: {item.question}</h4>
                  <p className="text-slate-600">R: {item.answer}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Ad 3 */}
        <AdSlot
          adClient={adClient}
          adSlot={adSlotBottom}
          adFormat="auto"
          className="mt-16"
        />
      </main>

      {/* Footer */}
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