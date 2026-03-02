// app/CalculatorClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdSlot from "@/components/AdSlot";
import {
  Percent,
  ArrowUp,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Award
} from "lucide-react";

const THEMES = {
  emerald: {
    primary: "emerald",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    ring: "ring-emerald-100",
    focus: "focus:ring-emerald-500/10",
    resultBg: "bg-emerald-50/40",
    resultText: "text-emerald-900",
    resultRing: "ring-emerald-100/50",
    resultBorder: "border-emerald-200/50",
    accentText: "text-emerald-600",
    percentText: "text-emerald-300",
    footerBg: "bg-white",
    footerText: "text-slate-600",
    footerRing: "ring-slate-100",
    hoverShadow: "hover:shadow-emerald-500/10",
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

const ACTIVE_THEME = THEMES.emerald; // Universal theme selection point

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
    hero: {
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      trustText: string;
    };
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
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">

      {/* Modern Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href={`/${locale}`} className="group flex items-center gap-3 transition-transform hover:scale-105">
              <span className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text} shadow-sm ring-1 ${ACTIVE_THEME.ring} transition-all group-hover:shadow-md group-hover:ring-2`}>
                <Zap size={22} strokeWidth={2.5} fill="currentColor" className="opacity-20" />
                <Zap size={22} strokeWidth={2.5} className="absolute drop-shadow-sm" />
              </span>
              <span className="hidden text-lg font-black uppercase tracking-tighter text-slate-900 sm:block">
                {translations.seo.h1.split(' ')[0]} <span className={ACTIVE_THEME.accentText}>Calc</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#calculators" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">{translations.ui.calculate}</a>
              <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
            </nav>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <a href="#calculators" className={`hidden sm:inline-flex items-center justify-center rounded-full ${ACTIVE_THEME.bg} px-5 py-2 text-sm font-bold ${ACTIVE_THEME.text} shadow-sm ring-1 ${ACTIVE_THEME.ring} transition-all hover:shadow-md hover:scale-105 active:scale-95`}>
              {translations.ui.hero.ctaPrimary}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full ${ACTIVE_THEME.bg} opacity-20 blur-[120px]`} />
          <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full ${ACTIVE_THEME.bg} opacity-10 blur-[120px]`} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center gap-2 rounded-full ${ACTIVE_THEME.bg} px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring} mb-6 sm:mb-8 animate-fade-in`}>
              <Zap size={12} fill="currentColor" className="sm:w-3.5 sm:h-3.5" /> 2026 Edition
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-7xl mb-6 sm:mb-8 leading-[1.1] animate-fade-in">
              {translations.ui.hero.title}
            </h1>
            <p className="text-base sm:text-xl leading-relaxed text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in [animation-delay:100ms]">
              {translations.ui.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 animate-fade-in [animation-delay:200ms]">
              <a href="#calculators" className={`w-full sm:w-auto inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-slate-900 px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95`}>
                {translations.ui.hero.ctaPrimary}
              </a>
              <a href="#formulas" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-white px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300 hover:scale-105 active:scale-95">
                {translations.ui.hero.ctaSecondary}
              </a>
            </div>
            <div className="flex flex-col items-center gap-6 sm:gap-8 animate-fade-in [animation-delay:300ms]">
              <p className="text-[10px] sm:text-sm font-black uppercase tracking-[0.3em] text-slate-400">
                {translations.ui.hero.trustText}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-16 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-base sm:text-xl font-black tracking-tighter">
                  <ShieldCheck size={18} className={`${ACTIVE_THEME.accentText} sm:w-6 sm:h-6`} /> SECURE
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-base sm:text-xl font-black tracking-tighter">
                  <CheckCircle2 size={18} className={`${ACTIVE_THEME.accentText} sm:w-6 sm:h-6`} /> PRECISE
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-base sm:text-xl font-black tracking-tighter">
                  <Award size={18} className={`${ACTIVE_THEME.accentText} sm:w-6 sm:h-6`} /> TRUSTED
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-20 sm:px-6 lg:px-8 overflow-x-hidden">
        <h2 className="sr-only">{translations.seo.intro}</h2>

        <AdSlot adClient={adClient} adSlot={adSlotTop} adFormat="horizontal" className="my-8" />

        {/* How It Works Section */}
        <section className="mb-16 sm:mb-32">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 sm:text-4xl mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">Three simple steps to solve any percentage problem.</p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Select Calculator", desc: "Choose the specific percentage problem you need to solve from our specialized cards." },
              { step: "02", title: "Input Values", desc: "Enter your numbers into the clearly marked fields. Results update instantly as you type." },
              { step: "03", title: "Get Results", desc: "Copy your precise result and see the underlying formula used for the calculation." }
            ].map((item, i) => (
              <div key={i} className="relative p-6 sm:p-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`text-3xl sm:text-4xl font-black ${ACTIVE_THEME.accentText} opacity-20 mb-3 sm:mb-4`}>{item.step}</div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div id="calculators" className="mt-2 flex flex-col gap-8 sm:gap-12">
        
          {/* Card A */}
          <section className={`group mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1 overflow-hidden`}>
            <div className={`border-l-4 border-emerald-500 bg-emerald-50/30 p-5 sm:p-8`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                    {cardA.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">{cardA.formulaDescription.split('.')[0]}.</p>
                </div>
                <div className={`inline-flex items-center rounded-xl ${ACTIVE_THEME.bg} px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-xs sm:text-sm font-black ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring}`}>
                  {cardA.formula}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-10">
              <div className="flex flex-wrap items-center justify-start sm:justify-center gap-3 sm:gap-4 gap-y-6 sm:gap-y-8">
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  {cardA.labelValue}
                </span>

                <div className="relative group/input">
                  <input
                    type="number"
                    value={calcA.percent}
                    onChange={(e) => setCalcA({ ...calcA, percent: e.target.value })}
                    placeholder="10"
                    className={`w-20 sm:w-32 rounded-xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4 text-lg sm:text-base sm:text-xl font-black text-slate-900
                              ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                              outline-none transition-all border border-slate-200/60 placeholder:text-slate-300`}
                  />
                  <div className="absolute -bottom-5 left-0 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Percentage</div>
                </div>

                <span className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring} shadow-sm`}>
                  <Percent size={20} strokeWidth={3} className="sm:w-6 sm:h-6" />
                </span>

                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  {cardA.labelTotal}
                </span>

                <div className="relative group/input">
                  <input
                    type="number"
                    value={calcA.total}
                    onChange={(e) => setCalcA({ ...calcA, total: e.target.value })}
                    placeholder="1000"
                    className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl sm:h-auto rounded-xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4 text-lg sm:text-base sm:text-xl font-black text-slate-900
                              ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                              outline-none transition-all border border-slate-200/60 placeholder:text-slate-300`}
                  />
                  <div className="absolute -bottom-5 left-0 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Total Value</div>
                </div>

                <span className="text-2xl sm:text-3xl font-black text-slate-200 mx-1 sm:mx-2">{translations.ui.isEqual}</span>

                <div className="relative">
                  <input
                    readOnly
                    value={calcA.result}
                    placeholder="—"
                    className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl ${ACTIVE_THEME.resultBg} px-3 py-3 sm:px-4 sm:py-4 text-xl sm:text-lg sm:text-2xl font-black ${ACTIVE_THEME.resultText}
                              shadow-inner ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                              border ${ACTIVE_THEME.resultBorder}`}
                  />
                  {calcA.result && (
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-bounce">
                      <Zap size={10} fill="currentColor" className="sm:w-3 sm:h-3" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>


          {/* Card B */}
          <section className={`group mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1 overflow-hidden`}>
            <div className={`border-l-4 border-emerald-500 bg-emerald-50/30 p-6 sm:p-8`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                    {cardB.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">{cardB.formulaDescription.split('.')[0]}.</p>
                </div>
                <div className={`inline-flex items-center rounded-xl ${ACTIVE_THEME.bg} px-4 py-2 font-mono text-sm font-black ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring}`}>
                  {cardB.formula}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-start sm:justify-center gap-4 gap-y-8">
                <div className="relative group/input">
                  <input
                    type="number"
                    value={calcB.value}
                    onChange={(e) => setCalcB({ ...calcB, value: e.target.value })}
                    placeholder="50"
                    className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl bg-slate-50 px-4 py-4 text-base sm:text-xl font-black text-slate-900
                              ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                              outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                              sm:w-32`}
                  />
                  <div className="absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Value</div>
                </div>

                <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 sm:text-base">
                  {cardB.labelTotal}
                </span>

                <div className="relative group/input">
                  <input
                    type="number"
                    value={calcB.total}
                    onChange={(e) => setCalcB({ ...calcB, total: e.target.value })}
                    placeholder="1000"
                    className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl sm:h-auto rounded-xl bg-slate-50 px-3 sm:px-4 py-2 sm:py-4 text-base sm:text-xl font-black text-base sm:text-xl font-black text-slate-900
                              ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                              outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                              sm:w-36`}
                  />
                  <div className="absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Total</div>
                </div>

                <span className="text-3xl font-black text-slate-200 mx-2">{translations.ui.isEqual}</span>

                <div className="relative">
                  <input
                    readOnly
                    value={calcB.result}
                    placeholder="—"
                    className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl rounded-xl ${ACTIVE_THEME.resultBg} px-4 py-4 text-lg sm:text-2xl font-black ${ACTIVE_THEME.resultText}
                              shadow-inner ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                              border ${ACTIVE_THEME.resultBorder} sm:w-44`}
                  />
                  <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-base sm:text-xl font-black ${ACTIVE_THEME.percentText}`}>
                    %
                  </span>
                  {calcB.result && (
                    <div className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-bounce">
                      <Zap size={12} fill="currentColor" />
                    </div>
                  )}
                </div>
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
  className={`group mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1 overflow-hidden`}
>
  <div className={`border-l-4 border-emerald-500 bg-emerald-50/30 p-6 sm:p-8`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
          {cardD.title}
        </h3>
        <p className="text-sm font-medium text-slate-500">{cardD.formulaDescription.split('.')[0]}.</p>
      </div>
      <div className={`inline-flex items-center rounded-xl ${ACTIVE_THEME.bg} px-4 py-2 font-mono text-sm font-black ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring}`}>
        {cardD.formula}
      </div>
    </div>
  </div>

  <div className="p-6 sm:p-10">
    <div className="flex flex-wrap items-center justify-start sm:justify-center gap-4 gap-y-8">
      <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 sm:text-base">
        {cardD.labelOld}
      </span>

      <div className="relative group/input">
        <input
          type="number"
          value={calcD.old}
          onChange={(e) => setCalcD({ ...calcD, old: e.target.value })}
          placeholder="1000"
          className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl rounded-xl bg-slate-50 px-3 sm:px-4 py-2 sm:py-4 text-base sm:text-xl font-black text-base sm:text-xl font-black text-slate-900
                    ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                    outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                    sm:w-36`}
        />
        <div className="absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Old Value</div>
      </div>

      <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 sm:text-base">
        {cardD.labelNew}
      </span>

      <div className="relative group/input">
        <input
          type="number"
          value={calcD.new}
          onChange={(e) => setCalcD({ ...calcD, new: e.target.value })}
          placeholder="1200"
          className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl bg-slate-50 px-3 sm:px-4 py-2 sm:py-4 text-base sm:text-xl font-black text-base sm:text-xl font-black text-slate-900
                    ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                    outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                    sm:w-36`}
        />
        <div className="absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">New Value</div>
      </div>

      <span className="text-3xl font-black text-slate-200 mx-2">{translations.ui.isEqual}</span>

      <div className="relative">
        <input
          readOnly
          value={calcD.result}
          placeholder="—"
          className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl ${ACTIVE_THEME.resultBg} px-4 py-4 text-lg sm:text-2xl font-black ${ACTIVE_THEME.resultText}
                    shadow-inner ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                    border ${ACTIVE_THEME.resultBorder} sm:w-44`}
        />
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-base sm:text-xl font-black ${ACTIVE_THEME.percentText}`}>
          %
        </span>
        {calcD.result && (
          <div className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-bounce">
            <Zap size={12} fill="currentColor" />
          </div>
        )}
      </div>
    </div>
  </div>
</section>
        {/* Card C */}
        <section
          id="calc-c"
          className={`group mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1 overflow-hidden`}
        >
          <div className={`border-l-4 border-emerald-500 bg-emerald-50/30 p-6 sm:p-8`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  {cardC.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">{cardC.formulaDescription.split('.')[0]}.</p>
              </div>
              <div className={`inline-flex items-center rounded-xl ${ACTIVE_THEME.bg} px-4 py-2 font-mono text-sm font-black ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring}`}>
                {cardC.formula}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-start sm:justify-center gap-4 gap-y-8">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 sm:text-base">
                {cardC.labelBase}
              </span>

              <div className="relative group/input">
                <input
                  type="number"
                  value={calcC.base}
                  onChange={(e) => setCalcC({ ...calcC, base: e.target.value })}
                  placeholder="1000"
                  className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl rounded-xl bg-slate-50 px-3 sm:px-4 py-2 sm:py-4 text-base sm:text-xl font-black text-base sm:text-xl font-black text-slate-900
                            ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                            outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                            sm:w-36`}
                />
                <div className="absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Base Value</div>
              </div>

              <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 sm:text-base">
                {cardC.labelChange}
              </span>

              <div className="relative group/input">
                <input
                  type="number"
                  value={calcC.percent}
                  onChange={(e) => setCalcC({ ...calcC, percent: e.target.value })}
                  placeholder="10"
                  className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl bg-slate-50 px-4 py-4 text-base sm:text-xl font-black text-slate-900
                            ring-2 ring-slate-100 ${ACTIVE_THEME.focus}
                            outline-none transition-all border border-slate-200/60 placeholder:text-slate-300
                            sm:w-32`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-base sm:text-xl font-black text-slate-300`}>
                  %
                </span>
                <div className="absolute -bottom-6 left-0 text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-focus-within/input:opacity-100 transition-opacity">Change %</div>
              </div>

              <span className="text-3xl font-black text-slate-200 mx-2">{translations.ui.isEqual}</span>

              <div className="relative">
                <input
                  readOnly
                  value={calcC.result}
                  placeholder="—"
                  className={`w-20 sm:w-32 h-10 sm:h-auto rounded-xl ${ACTIVE_THEME.resultBg} px-4 py-4 text-lg sm:text-2xl font-black ${ACTIVE_THEME.resultText}
                            shadow-inner ring-2 ${ACTIVE_THEME.resultRing} focus:outline-none
                            border ${ACTIVE_THEME.resultBorder} sm:w-44`}
                />
                {calcC.result && (
                  <div className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg animate-bounce">
                    <Zap size={12} fill="currentColor" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* SEO Content Section */}
        <div className="mt-32 space-y-24 border-t border-slate-200 pt-32">
          
          {/* Intro & How To */}
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {translations.seo.h1}
              </h2>
              <p className="text-xl leading-relaxed text-slate-600">
                {translations.seo.intro}
              </p>
            </div>
            
            <div className={`rounded-3xl bg-white p-8 sm:p-12 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200/60 relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${ACTIVE_THEME.bg} opacity-10 rounded-bl-full`} />
              <h3 className="mb-6 text-lg sm:text-2xl font-black text-slate-900">
                {translations.seo.howTo.title}
              </h3>
              <p className="mb-8 text-lg text-slate-600 leading-relaxed">{translations.seo.howTo.content}</p>
              <div className={`mb-8 rounded-2xl ${ACTIVE_THEME.bg} p-6 text-center font-mono text-base sm:text-xl font-black ${ACTIVE_THEME.text} ring-1 ${ACTIVE_THEME.ring}`}>
                {translations.seo.howTo.formula}
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 italic">{translations.seo.howTo.example}</p>
            </div>
          </div>

          {/* Situations & Why Us */}
          <div className="grid gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-slate-900">{translations.seo.situations.title}</h3>
              <p className="text-lg text-slate-600 leading-relaxed">{translations.seo.situations.content}</p>
              <ul className="grid gap-4">
                {translations.seo.situations.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:ring-emerald-200">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text}`}>
                      <Zap size={14} fill="currentColor" />
                    </span>
                    <span className="font-bold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-3xl font-black text-slate-900">{translations.seo.whyUs.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {translations.seo.whyUs.items.map((item, i) => (
                  <div key={i} className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1`}>
                    <p className="font-black text-slate-800 leading-tight">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-black text-slate-900 mb-4">{translations.seo.examples.title}</h3>
              <p className="text-slate-500 font-medium">Real-world scenarios where percentage calculations are essential.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {translations.seo.examples.items.map((item, i) => (
                <div key={i} className="rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all hover:shadow-2xl hover:ring-2 hover:ring-emerald-500/20">
                  <h4 className={`mb-4 text-lg font-black ${ACTIVE_THEME.accentText} uppercase tracking-tight`}>{item.title}</h4>
                  <p className="text-base leading-relaxed text-slate-600 font-medium">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Formulas */}
          <div id="formulas" className={`rounded-[3rem] ${ACTIVE_THEME.bg} p-12 text-center sm:p-20 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 border-8 border-white rounded-full" />
              <div className="absolute bottom-10 right-10 w-60 h-60 border-8 border-white rounded-full" />
            </div>
            <h3 className={`mb-12 text-4xl font-black ${ACTIVE_THEME.text} relative`}>
              {translations.seo.formulas.title}
            </h3>
            <div className="grid gap-8 md:grid-cols-2 relative">
              {translations.seo.formulas.items.map((item, i) => (
                <div key={i} className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600/60">
                    {item.label}
                  </span>
                  <div className="rounded-2xl bg-white p-6 font-mono text-lg sm:text-2xl font-black text-slate-900 shadow-xl ring-1 ring-emerald-200">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-12 text-lg font-bold text-emerald-800/70 relative">{translations.seo.formulas.content}</p>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="space-y-16">
            <div className="text-center">
              <h3 className="text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h3>
              <p className="text-slate-500 font-medium">Everything you need to know about percentage calculations.</p>
            </div>
            <div className="grid gap-6 max-w-4xl mx-auto">
              {translations.seo.faq.map((item, i) => (
                <div key={i} className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-xl hover:ring-emerald-200">
                  <h4 className="text-base sm:text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text} text-xs`}>?</span>
                    {item.question}
                  </h4>
                  <p className="text-lg leading-relaxed text-slate-600 pl-9">{item.answer}</p>
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
          className="mt-32"
        />
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-4 mb-20">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text} shadow-sm ring-1 ${ACTIVE_THEME.ring}`}>
                  <Zap size={22} strokeWidth={2.5} fill="currentColor" className="opacity-20" />
                  <Zap size={22} strokeWidth={2.5} className="absolute" />
                </span>
                <span className="text-base sm:text-xl font-black uppercase tracking-tighter">
                  {translations.seo.h1.split(' ')[0]} <span className={ACTIVE_THEME.accentText}>Calc</span>
                </span>
              </div>
              <p className="text-lg text-slate-500 max-w-sm leading-relaxed">
                The world's most precise and user-friendly percentage calculator. Built for speed, accuracy, and ease of use.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#calculators" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">Calculators</a></li>
                <li><a href="#formulas" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">Formulas</a></li>
                <li><a href="#faq" className="text-slate-500 hover:text-slate-900 transition-colors font-medium">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href={`/${locale}/privacy`} className="text-slate-500 hover:text-slate-900 transition-colors font-medium">{translations.ui.privacyPolicy}</a></li>
                <li><a href={`/${locale}/terms`} className="text-slate-500 hover:text-slate-900 transition-colors font-medium">{translations.ui.termsOfService}</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              &copy; {currentYear} {translations.seo.h1.split(' ')[0]} Calc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className={`h-2 w-2 rounded-full bg-emerald-500 animate-pulse`} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 sm:h-16 sm:w-16`}
        aria-label={translations.ui.backToTop}
      >
        <ArrowUp size={24} strokeWidth={3} />
      </button>

    </div>
  );
}