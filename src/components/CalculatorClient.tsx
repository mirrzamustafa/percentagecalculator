"use client";

import React, { useState, useEffect } from "react";
import AdSlot from "@/components/AdSlot";
import { Zap, ArrowUp, ChevronRight, Percent } from "lucide-react";

export default function CalculatorClient({
  locale,
  translations,
  adClient = "ca-pub-XXXXXXXXXXXXXXXX",
  adSlotTop = "1111111111",
  adSlotMid = "2222222222",
  adSlotBottom = "3333333333"
}: {
  locale: string,
  translations: any,
  adClient?: string,
  adSlotTop?: string,
  adSlotMid?: string,
  adSlotBottom?: string
}) {
  const { ui, seo } = translations;
  const { cardA, cardB, cardC, cardD, hints } = ui;

  // 1. Correct State Definitions including 'hint' to fix TypeScript errors
  const [calcA, setCalcA] = useState({ percent: "", total: "", result: "", hint: "" });
  const [calcB, setCalcB] = useState({ value: "", total: "", result: "", hint: "" });
  const [calcC, setCalcC] = useState({ base: "", percent: "", result: "", hint: "" });
  const [calcD, setCalcD] = useState({ old: "", new: "", result: "", hint: "" });

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  useEffect(() => setCurrentYear(new Date().getFullYear()), []);

  // 2. Updated Calculation Handlers with inline card error logic
  const runCalcA = () => {
    const p = parseFloat(calcA.percent);
    const t = parseFloat(calcA.total);
    if (isNaN(p) || isNaN(t)) {
      setCalcA({ ...calcA, result: "", hint: hints.enterValueAndTotal });
      return;
    }
    setCalcA({ ...calcA, result: ((p / 100) * t).toLocaleString(), hint: "" });
  };

  const runCalcB = () => {
    const v = parseFloat(calcB.value);
    const t = parseFloat(calcB.total);
    if (isNaN(v) || isNaN(t)) {
      setCalcB({ ...calcB, result: "", hint: hints.enterValueAndTotal });
      return;
    }
    if (t === 0) {
      setCalcB({ ...calcB, result: "", hint: hints.totalCannotBeZero });
      return;
    }
    setCalcB({ ...calcB, result: ((v / t) * 100).toFixed(2), hint: "" });
  };

  const runCalcC = () => {
    const b = parseFloat(calcC.base);
    const p = parseFloat(calcC.percent);
    if (isNaN(b) || isNaN(p)) {
      setCalcC({ ...calcC, result: "", hint: hints.enterBaseAndChange });
      return;
    }
    setCalcC({ ...calcC, result: (b * (1 + p / 100)).toLocaleString(), hint: "" });
  };

  const runCalcD = () => {
    const o = parseFloat(calcD.old);
    const n = parseFloat(calcD.new);
    if (isNaN(o) || isNaN(n)) {
      setCalcD({ ...calcD, result: "", hint: hints.enterOldAndNew });
      return;
    }
    if (o === 0) {
      setCalcD({ ...calcD, result: "", hint: hints.oldCannotBeZero });
      return;
    }
    setCalcD({ ...calcD, result: (((n - o) / o) * 100).toFixed(2), hint: "" });
  };

  const inputClass = "w-full border-2 border-slate-400 bg-white p-3 text-xl font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none rounded shadow-sm no-spinner transition-all";
  const labelClass = "mb-2 text-base sm:text-lg font-bold text-slate-800 ";

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 antialiased font-sans pb-20 selection:bg-blue-100">
      
    {/* Header with French Branding & Logo */}
    <header className="border-b-4 border-blue-500 bg-white py-4 shadow-md sticky top-0 z-50">
      <a href={`/${locale}`}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded shadow-lg">
            <Percent size={24} className="text-white" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase leading-none">
              {locale === 'fr' ? "Calculer Le Pourcentage" : "Calculate Percentage"}
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {locale === 'fr' ? "calculer un pourcentage" : "percent math tool"}
            </span>
          </div>
        </div>
      </div>
      </a>
    </header>
      
      <AdSlot adClient={adClient} adSlot={adSlotTop} />

      <main className="mx-auto mt-10 w-full max-w-5xl px-4 space-y-10">
        {/* Striking, Sharp Keyword-Rich Headline */}
        <div className="border-l-8 border-blue-500 bg-white p-6 sm:p-8 rounded shadow-sm">
           <h2 className=" text-slate-900 leading-[1.1] tracking-tight capitalize">
              {locale === 'fr' 
                ? "Le calculateur de pourcentage est un outil en ligne gratuit pour calculer un pourcentage." 
                : "Percentage Calculator is a free online tool to calculate percentages."}
           </h2>
        </div>

      {/* Card A: Percent to Number */}
      <section className="rounded-xl border-2 border-slate-300 bg-[#ebedef] p-5 sm:p-10 shadow-lg relative">
        <h2 className="mb-6 text-xl font-black text-[#1a365d] border-b-2 border-slate-300 pb-2 uppercase">{cardA.title}</h2>
        
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Input Row: Balanced for French labels and larger boxes */}
          <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
            <span className={labelClass}>{cardA.labelValue}</span>
            
            {/* Input with internal % symbol */}
            <div className="w-[35%] sm:w-32 shrink-0 relative">
              <input 
                type="number" 
                value={calcA.percent} 
                onChange={(e) => setCalcA({ ...calcA, percent: e.target.value })} 
                className={`${inputClass} pr-7 sm:pr-8`} // Padding added to avoid text overlapping the %
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 font-black text-sm sm:text-base pointer-events-none">
                %
              </span>
            </div>

            <span className={labelClass}>{cardA.labelTotal}</span>
            
            <div className="w-[30%] sm:w-48 shrink-0">
              <input 
                type="number" 
                value={calcA.total} 
                onChange={(e) => setCalcA({ ...calcA, total: e.target.value })} 
                className={inputClass} 
              />
            </div>
          </div>

          {/* Action & Result Row */}
          <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
            {calcA.hint && (
              <span className="absolute -top-5 left-0 text-[10px] font-black uppercase text-red-600 leading-none">
                {calcA.hint}
              </span>
            )}
            <button 
              onClick={runCalcA} 
              className="w-full lg:w-48 flex items-center justify-center gap-2 rounded bg-blue-500 py-4 text-lg font-black uppercase text-white shadow-xl active:scale-95 transition-all"
            >
              {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
            </button>
            <div className="w-full lg:w-48 bg-white border-2 border-blue-500 py-3 text-2xl font-black text-blue-500 text-center rounded shadow-inner">
              {calcA.result || "---"}
            </div>
          </div>
        </div>
      </section>
        {/* Card B: Number to Percent */}
        <section className="rounded-xl border-2 border-slate-300 bg-[#ebedef] p-6 sm:p-10 shadow-lg relative">
          <h2 className="mb-6 text-xl font-black text-[#1a365d] border-b-2 border-slate-300 pb-2 uppercase">{cardB.title}</h2>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex flex-row items-center gap-3 flex-1">
              <div className="w-24 sm:w-32">
                <input type="number" value={calcB.value} onChange={(e) => setCalcB({ ...calcB, value: e.target.value })} className={inputClass} />
              </div>
              <span className={labelClass}>{cardB.labelTotal}</span>
              <div className="flex-1 lg:flex-initial lg:w-48">
                <input type="number" value={calcB.total} onChange={(e) => setCalcB({ ...calcB, total: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
              {calcB.hint && (
                <span className="absolute -top-6 left-0 text-xs font-black uppercase text-red-600 tracking-tight">
                  {calcB.hint}
                </span>
              )}
              <button onClick={runCalcB} className="w-full lg:w-48 flex items-center justify-center gap-2 rounded bg-blue-500 py-4 text-lg font-black uppercase text-white shadow-xl active:scale-95 transition-all">
                {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
              </button>
              <div className="w-full lg:w-48 bg-white border-2 border-blue-500 py-3 text-2xl font-black text-blue-500 text-center rounded shadow-inner flex items-center justify-center gap-1">
                {calcB.result || "---"} <span className="text-blue-400 text-lg font-black">%</span>
              </div>
            </div>
          </div>
        </section>

        <AdSlot adClient={adClient} adSlot={adSlotMid} />

        {/* Card D: Percentage Change */}
        <section className="rounded-xl border-2 border-slate-300 bg-[#ebedef] p-6 sm:p-10 shadow-lg relative">
          <h2 className="mb-6 text-xl font-black text-[#1a365d] border-b-2 border-slate-300 pb-2 uppercase">{cardD.title}</h2>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex flex-row items-center gap-3 flex-1">
                <span className={labelClass}>{cardD.labelOld}</span>
                <div className="flex-1">
                  <input type="number" value={calcD.old} onChange={(e) => setCalcD({ ...calcD, old: e.target.value })} className={inputClass} />
                </div>
                <span className={labelClass}>{cardD.labelNew}</span>
                <div className="flex-1">
                  <input type="number" value={calcD.new} onChange={(e) => setCalcD({ ...calcD, new: e.target.value })} className={inputClass} />
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
              {calcD.hint && (
                <span className="absolute -top-6 left-0 text-xs font-black uppercase text-red-600 tracking-tight">
                  {calcD.hint}
                </span>
              )}
              <button onClick={runCalcD} className="w-full lg:w-48 flex items-center justify-center gap-2 rounded bg-blue-500 py-4 text-lg font-black uppercase text-white shadow-xl transition-all">
                {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
              </button>
              <div className="w-full lg:w-48 bg-white border-2 border-blue-500 py-3 text-2xl font-black text-blue-500 text-center rounded shadow-inner flex items-center justify-center gap-1">
                {calcD.result || "---"} <span className="text-blue-400 text-lg font-black">%</span>
              </div>
            </div>
          </div>
        </section>
        {/* Card C: Increase / Decrease */}
        <section className="rounded-xl border-2 border-slate-300 bg-[#ebedef] p-5 sm:p-10 shadow-lg relative">
          <h2 className="mb-4 text-xl font-black text-[#1a365d] border-b-2 border-slate-300 pb-2 uppercase tracking-tight">
            {cardC.title}
          </h2>
          {/* Label kept above to prevent horizontal crowding on mobile */}
          <p className={labelClass}>{cardC.labelBase}</p>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex flex-row items-center gap-3 flex-1 min-w-0">
              <div className="w-[50%] sm:w-44 shrink-0">
                <input type="number" value={calcC.base} onChange={(e) => setCalcC({ ...calcC, base: e.target.value })} className={inputClass} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-700 uppercase shrink-0">{cardC.labelChange}</span>
              <div className="w-[35%] sm:w-32 shrink-0 relative">
                <input type="number" value={calcC.percent} onChange={(e) => setCalcC({ ...calcC, percent: e.target.value })} className={inputClass} />
                <span className="absolute right-2 top-3 text-slate-400 font-black text-xs sm:text-sm">%</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
              {calcC.hint && <span className="absolute -top-5 left-0 text-[10px] font-black uppercase text-red-600 leading-none">{calcC.hint}</span>}
              <button onClick={runCalcC} className="w-full lg:w-48 flex items-center justify-center gap-3 rounded bg-blue-500 py-4 text-lg font-black uppercase tracking-tighter text-white shadow-xl hover:bg-blue-800 active:scale-95 transition-all">
                {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
              </button>
              <div className="w-full lg:w-48 bg-white border-2 border-blue-500 p-3.5 text-2xl font-black text-blue-500 text-center rounded shadow-inner">
                {calcC.result || "---"}
              </div>
            </div>
          </div>
        </section>
        {/* SEO CONTENT SECTION */}
        <div className="mt-24 space-y-16 border-t-4 border-slate-300 pt-20 pb-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black text-slate-900 leading-[1.1] mb-8 uppercase tracking-tight">
              {seo.h1}
            </h2>
            <p className="text-xl font-bold text-slate-700 leading-relaxed italic border-l-8 border-blue-500 pl-6">
              {seo.intro}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="bg-white border-2 border-slate-300 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">{seo.howTo.title}</h3>
              <p className="text-lg text-slate-800 font-bold mb-4">{seo.howTo.content}</p>
              <div className="bg-slate-900 p-6 rounded shadow-lg mb-4">
                <code className="text-blue-400 font-black text-xl sm:text-2xl block text-center">
                  {seo.howTo.formula}
                </code>
              </div>
              <p className="text-base text-slate-600 font-bold">{seo.howTo.example}</p>
            </div>

            <div className="bg-white border-2 border-slate-300 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">{seo.situations.title}</h3>
              <ul className="space-y-4">
                {seo.situations.items.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-4 text-slate-800 font-bold text-lg items-start">
                    <Zap size={24} className="text-blue-500 shrink-0 mt-1" fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Examples */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-slate-900 text-center uppercase tracking-tight">
              {seo.examples.title}
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {seo.examples.items.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm transition-all hover:border-blue-300">
                  <h5 className="font-black text-blue-500 mb-3 text-lg">{item.title}</h5>
                  <p className="text-sm text-slate-700 font-bold leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="max-w-4xl mx-auto space-y-12">
            <h3 className="text-3xl font-black text-slate-900 text-center uppercase tracking-tight">FAQ</h3>
            <div className="space-y-6">
              {seo.faq.map((item: any, idx: number) => (
                <div key={idx} className="p-8 bg-white rounded-xl border-2 border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                  <p className="font-black text-slate-900 text-xl mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm">?</span>
                    {item.question}
                  </p>
                  <p className="text-slate-700 font-semibold leading-relaxed pl-11">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AdSlot adClient={adClient} adSlot={adSlotBottom} />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
           <p className="text-sm font-bold uppercase tracking-widest mb-6">&copy; {currentYear} {seo.h1.split(' ')[0]} Calc</p>
           <div className="flex justify-center gap-10 text-xs font-bold uppercase">
              <a href={`/${locale}/privacy`} className="hover:text-white transition-colors">{ui.privacyPolicy}</a>
              <a href={`/${locale}/terms`} className="hover:text-white transition-colors">{ui.termsOfService}</a>
           </div>
        </div>
      </footer>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-10 right-10 h-16 w-16 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <ArrowUp size={28} strokeWidth={4} />
      </button>

    </div>
  );
}