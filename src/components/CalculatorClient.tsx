// app/CalculatorClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdSlot from "@/components/AdSlot";
import { 
  Percent, 
  Sigma, 
  TrendingUp, 
  Activity, 
  ArrowUp,
  Zap 
} from "lucide-react";

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
    content: string;
    faq: { question: string; answer: string }[];
  };
  ui: {
    calculate: string;
    backToTop: string;
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

export default function CalculatorClient({ locale, translations, adClient = "ca-pub-XXXXXXXXXXXXXXXX", adSlotTop = "1111111111", adSlotMid = "2222222222", adSlotBottom = "3333333333" }: Props) {
  const h = translations.ui.hints;

  // State for calculations
  const [calcA, setCalcA] = useState({ percent: "", total: "", result: "", hint: "", tone: "" });
  const [calcB, setCalcB] = useState({ value: "", total: "", result: "", hint: "", tone: "" });
  const [calcC, setCalcC] = useState({ base: "", percent: "", result: "", hint: "", tone: "" });
  const [calcD, setCalcD] = useState({ old: "", new: "", result: "", hint: "", tone: "" });
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Helpers
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

  // Logic Functions
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
    setCalcC(prev => ({ ...prev, result: roundSmart(res), hint: p > 0 ? h.increase : p < 0 ? h.decrease : h.noChange, tone: "ok" }));
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
    setCalcD(prev => ({ ...prev, result: roundSmart(val), hint: val > 0 ? h.increase : val < 0 ? h.decrease : h.noChange, tone: "ok" }));
  }, [calcD.old, calcD.new, h.increase, h.decrease, h.noChange, h.oldCannotBeZero]);

  // Live updates
  useEffect(() => { handleCalcA(); }, [handleCalcA]);
  useEffect(() => { handleCalcB(); }, [handleCalcB]);
  useEffect(() => { handleCalcC(); }, [handleCalcC]);
  useEffect(() => { handleCalcD(); }, [handleCalcD]);

  const getHintClass = (tone: string) => {
    if (tone === "ok") return "text-emerald-600";
    if (tone === "warn") return "text-amber-600";
    return "text-slate-500";
  };

  const { cardA, cardB, cardC, cardD } = translations.ui;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200">
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

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* SEO Hidden H2 */}
        <h2 className="sr-only">{translations.seo.intro}</h2>

        {/* Ad 1 */}
        <AdSlot
          adClient={adClient}
          adSlot={adSlotTop}
          adFormat="horizontal"
          className="my-4"
        />

        <div id="calculators" className="mt-2 grid gap-6 md:grid-cols-2">
          
          {/* Card A */}
          <section id="calc-a" className="group rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl hover:shadow-emerald-50/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                <Percent size={20} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 leading-tight">{cardA.title}</h3>
                <p className="text-sm font-medium text-emerald-600 italic">{cardA.formula}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="a-percent" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardA.labelValue}</label>
                <div className="relative">
                  <input id="a-percent" type="number" value={calcA.percent} onChange={(e) => setCalcA({...calcA, percent: e.target.value})} placeholder="10" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">%</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="a-total" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardA.labelTotal}</label>
                <input id="a-total" type="number" value={calcA.total} onChange={(e) => setCalcA({...calcA, total: e.target.value})} placeholder="1000" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="a-result" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardA.labelResult}</label>
                <input id="a-result" readOnly value={calcA.result} placeholder="—" className="w-full rounded-xl bg-emerald-50/50 px-3 py-2.5 text-xl font-bold text-emerald-800 shadow-sm ring-2 ring-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 border border-emerald-200/40" />
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest ring-1 ring-emerald-200">Formula</span>
                <div className="h-px flex-1 bg-emerald-100/50"></div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {cardA.formulaDescription}
              </p>
              <div className="mt-2 text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getHintClass(calcA.tone)}`}>{calcA.hint}</span>
              </div>
            </div>
          </section>

          {/* Card B */}
          <section id="calc-b" className="group rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl hover:shadow-emerald-50/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                <Sigma size={20} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 leading-tight">{cardB.title}</h3>
                <p className="text-sm font-medium text-emerald-600 italic">{cardB.formula}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="b-value" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardB.labelValue}</label>
                <input id="b-value" type="number" value={calcB.value} onChange={(e) => setCalcB({...calcB, value: e.target.value})} placeholder="50" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="b-total" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardB.labelTotal}</label>
                <input id="b-total" type="number" value={calcB.total} onChange={(e) => setCalcB({...calcB, total: e.target.value})} placeholder="1000" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="b-result" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardB.labelResult}</label>
                <div className="relative">
                  <input id="b-result" readOnly value={calcB.result} placeholder="—" className="w-full rounded-xl bg-emerald-50/50 px-3 py-2.5 text-xl font-bold text-emerald-800 shadow-sm ring-2 ring-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 border border-emerald-200/40" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-bold text-emerald-200/50">%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest ring-1 ring-emerald-200">Formula</span>
                <div className="h-px flex-1 bg-emerald-100/50"></div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {cardB.formulaDescription}
              </p>
              <div className="mt-2 text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getHintClass(calcB.tone)}`}>{calcB.hint}</span>
              </div>
            </div>
          </section>

          {/* Ad 2 */}
          <div className="md:col-span-2 my-2">
            <AdSlot
              adClient={adClient}
              adSlot={adSlotMid}
              adFormat="auto"
              className="my-0"
            />
          </div>

          {/* Card C */}
          <section id="calc-c" className="group rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl hover:shadow-emerald-50/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                <TrendingUp size={20} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 leading-tight">{cardC.title}</h3>
                <p className="text-sm font-medium text-emerald-600 italic">{cardC.formula}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="c-base" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardC.labelBase}</label>
                <input id="c-base" type="number" value={calcC.base} onChange={(e) => setCalcC({...calcC, base: e.target.value})} placeholder="1000" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="c-percent" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardC.labelChange}</label>
                <div className="relative">
                  <input id="c-percent" type="number" value={calcC.percent} onChange={(e) => setCalcC({...calcC, percent: e.target.value})} placeholder="10" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">%</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="c-result" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardC.labelResult}</label>
                <input id="c-result" readOnly value={calcC.result} placeholder="—" className="w-full rounded-xl bg-emerald-50/50 px-3 py-2.5 text-xl font-bold text-emerald-800 shadow-sm ring-2 ring-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 border border-emerald-200/40" />
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest ring-1 ring-emerald-200">Formula</span>
                <div className="h-px flex-1 bg-emerald-100/50"></div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {cardC.formulaDescription}
              </p>
              <div className="mt-2 text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getHintClass(calcC.tone)}`}>{calcC.hint}</span>
              </div>
            </div>
          </section>

          {/* Card D */}
          <section id="calc-d" className="group rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-all hover:shadow-xl hover:shadow-emerald-50/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200">
                <Activity size={20} strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 leading-tight">{cardD.title}</h3>
                <p className="text-sm font-medium text-emerald-600 italic">{cardD.formula}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="d-old" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardD.labelOld}</label>
                <input id="d-old" type="number" value={calcD.old} onChange={(e) => setCalcD({...calcD, old: e.target.value})} placeholder="1000" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="d-new" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardD.labelNew}</label>
                <input id="d-new" type="number" value={calcD.new} onChange={(e) => setCalcD({...calcD, new: e.target.value})} placeholder="1200" className="w-full rounded-xl bg-white px-3 py-2.5 text-lg font-semibold text-slate-800 ring-2 ring-slate-100 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white outline-none transition-all border border-slate-200/60 placeholder:font-normal placeholder:text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="d-result" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">{cardD.labelResult}</label>
                <div className="relative">
                  <input id="d-result" readOnly value={calcD.result} placeholder="—" className="w-full rounded-xl bg-emerald-50/50 px-3 py-2.5 text-xl font-bold text-emerald-800 shadow-sm ring-2 ring-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 border border-emerald-200/40" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-bold text-emerald-200/50">%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest ring-1 ring-emerald-200">Formula</span>
                <div className="h-px flex-1 bg-emerald-100/50"></div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {cardD.formulaDescription}
              </p>
              <div className="mt-2 text-right">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getHintClass(calcD.tone)}`}>{calcD.hint}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Ad 3 */}
        <AdSlot
          adClient={adClient}
          adSlot={adSlotBottom}
          adFormat="auto"
          className="mt-10"
        />
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"><Percent size={16} strokeWidth={3} /></span>
            <div>
              <div className="text-base font-bold text-slate-900">{translations.seo.h1}</div>
              <div className="text-xs font-medium text-slate-500">© {currentYear}</div>
            </div>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
            <ArrowUp size={16} /> {translations.ui.backToTop}
          </a>
        </div>
      </footer>
    </div>
  );
}
