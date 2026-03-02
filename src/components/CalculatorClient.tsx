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
  indigo: {
    primary: "indigo",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    ring: "ring-indigo-100",
    focus: "focus:ring-indigo-500/10",
    resultBg: "bg-indigo-50/50",
    resultText: "text-indigo-700",
    resultRing: "ring-indigo-100",
    resultBorder: "border-indigo-100",
    accentText: "text-indigo-600",
    percentText: "text-indigo-400",
    footerBg: "bg-white",
    footerText: "text-slate-500",
    footerRing: "ring-slate-100",
    hoverShadow: "hover:shadow-indigo-500/5",
    linkHover: "hover:text-indigo-600"
  }
};

const ACTIVE_THEME = THEMES.indigo;

// ... (Types remain the same as your original code)

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

  // ... (Calculation logic handleCalcA, B, C, D remains same)
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

  const { cardA, cardB, cardC, cardD } = translations.ui;

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Refined Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <a href={`/${locale}`} className="flex items-center gap-2.5">
              <span className={`h-8 w-8 flex items-center justify-center rounded-lg ${ACTIVE_THEME.bg} ${ACTIVE_THEME.text}`}>
                <Zap size={18} fill="currentColor" />
              </span>
              <span className="text-base font-bold tracking-tight text-slate-800">
                {translations.seo.h1.split(' ')[0]}<span className={ACTIVE_THEME.text}>Calc</span>
              </span>
            </a>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#calculators" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors">{translations.ui.calculate}</a>
            <a href="#faq" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-24">
        
        <div id="calculators" className="space-y-6">
          {/* Card A: Percentage Of */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:border-indigo-200">
            <div className="bg-indigo-50/50 border-b border-slate-100 p-4 sm:px-6">
               <h3 className="text-[16px] font-bold text-slate-800">{cardA.title}</h3>
               <p className="text-[14px] text-slate-500 font-medium">{cardA.formulaDescription.split('.')[0]}.</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardA.labelValue}</span>
                <input
                  type="number"
                  value={calcA.percent}
                  onChange={(e) => setCalcA({ ...calcA, percent: e.target.value })}
                  className="w-20 sm:w-28 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all no-spinner"
                />
                <Percent size={14} className="text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardA.labelTotal}</span>
                <input
                  type="number"
                  value={calcA.total}
                  onChange={(e) => setCalcA({ ...calcA, total: e.target.value })}
                  className="w-24 sm:w-32 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all no-spinner"
                />
                <span className="text-xl font-light text-slate-500 mx-1">＝</span>
                <div className="relative">
                  <input
                    readOnly
                    value={calcA.result}
                    className="w-28 sm:w-40 h-10 rounded-lg bg-indigo-50 px-4 text-sm font-bold text-indigo-700 border border-indigo-100 text-center"
                  />
                  {calcA.result && <Zap size={10} className="absolute -top-1.5 -right-1.5 text-indigo-500 fill-indigo-500" />}
                </div>
              </div>
            </div>
          </section>

          {/* Card B: What Percent is X of Y */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:border-indigo-200">
            <div className="bg-indigo-50/50 border-b border-slate-100 p-4 sm:px-6">
               <h3 className="text-[16px] font-bold text-slate-800">{cardB.title}</h3>
               <p className="text-[14px] text-slate-500 font-medium">{cardB.formulaDescription.split('.')[0]}.</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <input
                  type="number"
                  value={calcB.value}
                  onChange={(e) => setCalcB({ ...calcB, value: e.target.value })}
                  className="w-20 sm:w-28 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 transition-all no-spinner"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardB.labelTotal}</span>
                <input
                  type="number"
                  value={calcB.total}
                  onChange={(e) => setCalcB({ ...calcB, total: e.target.value })}
                  className="w-24 sm:w-32 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 transition-all no-spinner"
                />
                <span className="text-xl font-light text-slate-500 mx-1">＝</span>
                <div className="relative">
                  <input
                    readOnly
                    value={calcB.result}
                    className="w-28 sm:w-40 h-10 rounded-lg bg-indigo-50 px-4 text-sm font-bold text-indigo-700 border border-indigo-100 text-center"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-400">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Card C: Percentage Change */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:border-indigo-200">
            <div className="bg-indigo-50/50 border-b border-slate-100 p-4 sm:px-6">
               <h3 className="text-[16px] font-bold text-slate-800">{cardD.title}</h3>
               <p className="text-[14px] text-slate-500 font-medium">{cardD.formulaDescription.split('.')[0]}.</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardD.labelOld}</span>
                <input
                  type="number"
                  value={calcD.old}
                  onChange={(e) => setCalcD({ ...calcD, old: e.target.value })}
                  className="w-24 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 transition-all no-spinner"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardD.labelNew}</span>
                <input
                  type="number"
                  value={calcD.new}
                  onChange={(e) => setCalcD({ ...calcD, new: e.target.value })}
                  className="w-24 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 transition-all no-spinner"
                />
                <span className="text-xl font-light text-slate-500 mx-1">＝</span>
                <div className="relative">
                  <input
                    readOnly
                    value={calcD.result}
                    className="w-28 sm:w-40 h-10 rounded-lg bg-indigo-50 px-4 text-sm font-bold text-indigo-700 border border-indigo-100 text-center"
                  />
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-400">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Card D: Increase/Decrease Base */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:border-indigo-200">
            <div className="bg-indigo-50/50 border-b border-slate-100 p-4 sm:px-6">
               <h3 className="text-[16px] font-bold text-slate-800">{cardC.title}</h3>
               <p className="text-[14px] text-slate-500 font-medium">{cardC.formulaDescription.split('.')[0]}.</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardC.labelBase}</span>
                <input
                  type="number"
                  value={calcC.base}
                  onChange={(e) => setCalcC({ ...calcC, base: e.target.value })}
                  className="w-24 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 transition-all no-spinner"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cardC.labelChange}</span>
                <div className="relative">
                  <input
                    type="number"
                    value={calcC.percent}
                    onChange={(e) => setCalcC({ ...calcC, percent: e.target.value })}
                    className="w-20 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 focus:border-indigo-500 transition-all no-spinner"
                  />
                   <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">%</span>
                </div>
                <span className="text-xl font-light text-slate-500 mx-1">＝</span>
                <input
                  readOnly
                  value={calcC.result}
                  className="w-28 sm:w-40 h-10 rounded-lg bg-indigo-50 px-4 text-sm font-bold text-indigo-700 border border-indigo-100 text-center"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Informative Content Section */}
        <div className="mt-32 space-y-24 border-t border-slate-100 pt-24">
           <div className="grid gap-12 lg:grid-cols-2 items-start">
              <div>
                 <h2 className="text-3xl font-bold text-slate-900 mb-6">{translations.seo.h1}</h2>
                 <p className="text-base text-slate-500 leading-relaxed mb-6">{translations.seo.intro}</p>
                 <div className="space-y-4">
                    {translations.seo.whyUs.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <CheckCircle2 size={16} className="text-indigo-500" /> {item}
                      </div>
                    ))}
                 </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-8 border border-slate-200">
                 <h4 className="text-[16px] font-bold text-slate-800 mb-4">{translations.seo.howTo.title}</h4>
                 <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm text-indigo-600 text-center mb-4">
                    {translations.seo.howTo.formula}
                 </div>
                 <p className="text-sm text-slate-500 leading-relaxed">{translations.seo.howTo.content}</p>
              </div>
           </div>
        </div>

      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
             &copy; {currentYear} {translations.seo.h1.split(' ')[0]} Calc
           </p>
           <div className="flex justify-center gap-6 text-[14px] font-bold uppercase tracking-wider text-slate-500">
              <a href={`/${locale}/privacy`} className="hover:text-indigo-600 transition-colors">{translations.ui.privacyPolicy}</a>
              <a href={`/${locale}/terms`} className="hover:text-indigo-600 transition-colors">{translations.ui.termsOfService}</a>
           </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 h-12 w-12 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
      >
        <ArrowUp size={20} />
      </button>

    </div>
  );
}