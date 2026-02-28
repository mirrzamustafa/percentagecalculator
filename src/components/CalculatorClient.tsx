// app/CalculatorClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { 
  Percent, 
  Sigma, 
  TrendingUp, 
  Activity, 
  Calculator, 
  Copy, 
  ArrowUp 
} from "lucide-react";

export default function CalculatorClient() {
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

  const copyToClipboard = async (text: string, setter: any, currentState: any) => {
    if (!text) {
      setter({ ...currentState, hint: "Nothing to copy.", tone: "warn" });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setter({ ...currentState, hint: "Copied.", tone: "ok" });
      setTimeout(() => setter((prev: any) => ({ ...prev, hint: "", tone: "" })), 1200);
    } catch {
      setter({ ...currentState, hint: "Copy failed.", tone: "warn" });
    }
  };

  // Logic Functions
  const handleCalcA = () => {
    const p = num(calcA.percent);
    const t = num(calcA.total);
    if (!isFinite(p) || !isFinite(t)) {
      setCalcA({ ...calcA, result: "", hint: "Enter value and total.", tone: "warn" });
      return;
    }
    setCalcA({ ...calcA, result: roundSmart((p / 100) * t), hint: "Done.", tone: "ok" });
  };

  const handleCalcB = () => {
    const v = num(calcB.value);
    const t = num(calcB.total);
    if (!isFinite(v) || !isFinite(t)) {
      setCalcB({ ...calcB, result: "", hint: "Enter value and total.", tone: "warn" });
      return;
    }
    if (t === 0) {
      setCalcB({ ...calcB, result: "", hint: "Total can't be 0.", tone: "warn" });
      return;
    }
    setCalcB({ ...calcB, result: roundSmart((v / t) * 100), hint: "Done.", tone: "ok" });
  };

  const handleCalcC = () => {
    const base = num(calcC.base);
    const p = num(calcC.percent);
    if (!isFinite(base) || !isFinite(p)) {
      setCalcC({ ...calcC, result: "", hint: "Enter base and change.", tone: "warn" });
      return;
    }
    const res = base * (1 + p / 100);
    setCalcC({ ...calcC, result: roundSmart(res), hint: p > 0 ? "Increase." : p < 0 ? "Decrease." : "No change.", tone: "ok" });
  };

  const handleCalcD = () => {
    const oldV = num(calcD.old);
    const newV = num(calcD.new);
    if (!isFinite(oldV) || !isFinite(newV)) {
      setCalcD({ ...calcD, result: "", hint: "Enter old and new.", tone: "warn" });
      return;
    }
    if (oldV === 0) {
      setCalcD({ ...calcD, result: "", hint: "Old can't be 0.", tone: "warn" });
      return;
    }
    const val = ((newV - oldV) / oldV) * 100;
    setCalcD({ ...calcD, result: roundSmart(val), hint: val > 0 ? "Increase." : val < 0 ? "Decrease." : "No change.", tone: "ok" });
  };

  const getHintClass = (tone: string) => {
    if (tone === "ok") return "text-emerald-600";
    if (tone === "warn") return "text-amber-600";
    return "text-slate-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50">
                <Percent size={28} strokeWidth={2.5} />
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Percentage <span className="text-blue-400">Calculator</span>
              </h1>
            </div>
            <p className="max-w-prose text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-base">
              Fast • Accurate • Simple
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* SEO Hidden H2 to structure the page for crawlers */}
        <h2 className="sr-only">Free Online Percentage Calculation Tools</h2>

        <div id="calculators" className="mt-6 grid gap-6 lg:grid-cols-2">
          
          {/* Card A */}
          <section id="calc-a" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Percent to Number</h3>
                <p className="text-sm font-medium text-slate-500 italic">X% of Y = ?</p>
              </div>
              <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-400 ring-1 ring-blue-100"><Percent size={18} /></span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_1fr] sm:items-center">
                <label htmlFor="a-percent" className="text-xs font-bold text-slate-700">Value</label>
                <div className="relative">
                  <input id="a-percent" type="number" value={calcA.percent} onChange={(e) => setCalcA({...calcA, percent: e.target.value})} placeholder="10" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
                <label htmlFor="a-total" className="text-xs font-bold text-slate-700 sm:text-right">Total</label>
                <input id="a-total" type="number" value={calcA.total} onChange={(e) => setCalcA({...calcA, total: e.target.value})} placeholder="1000" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                <label htmlFor="a-result" className="text-xs font-bold text-slate-700">Result</label>
                <div className="relative">
                  <input id="a-result" readOnly value={calcA.result} placeholder="—" className="w-full rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-blue-400 ring-1 ring-slate-200" />
                  <button aria-label="Copy result" onClick={() => copyToClipboard(calcA.result, setCalcA, calcA)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"><Copy size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={handleCalcA} className="inline-flex items-center gap-2 rounded-2xl bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"><Calculator size={16} /> Calculate</button>
                <p aria-live="polite" className={`text-xs font-medium ${getHintClass(calcA.tone)}`}>{calcA.hint}</p>
              </div>
            </div>
          </section>

          {/* Card B */}
          <section id="calc-b" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Number to Percent</h3>
                <p className="text-sm font-medium text-slate-500 italic">X out of Y = what %?</p>
              </div>
              <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-400 ring-1 ring-blue-100"><Sigma size={18} /></span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_1fr] sm:items-center">
                <label htmlFor="b-value" className="text-xs font-bold text-slate-700">Value</label>
                <input id="b-value" type="number" value={calcB.value} onChange={(e) => setCalcB({...calcB, value: e.target.value})} placeholder="50" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                <label htmlFor="b-total" className="text-xs font-bold text-slate-700 sm:text-right">Total</label>
                <input id="b-total" type="number" value={calcB.total} onChange={(e) => setCalcB({...calcB, total: e.target.value})} placeholder="1000" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                <label htmlFor="b-result" className="text-xs font-bold text-slate-700">Result</label>
                <div className="relative">
                  <input id="b-result" readOnly value={calcB.result} placeholder="—" className="w-full rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-blue-400 ring-1 ring-slate-200" />
                  <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  <button aria-label="Copy result" onClick={() => copyToClipboard(calcB.result, setCalcB, calcB)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"><Copy size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={handleCalcB} className="inline-flex items-center gap-2 rounded-2xl bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"><Calculator size={16} /> Calculate</button>
                <p aria-live="polite" className={`text-xs font-medium ${getHintClass(calcB.tone)}`}>{calcB.hint}</p>
              </div>
            </div>
          </section>

          {/* Card C */}
          <section id="calc-c" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Increase / Decrease</h3>
                <p className="text-sm font-medium text-slate-500 italic">Base ± X% = ?</p>
              </div>
              <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-400 ring-1 ring-blue-100"><TrendingUp size={18} /></span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_1fr] sm:items-center">
                <label htmlFor="c-base" className="text-xs font-bold text-slate-700">Base</label>
                <input id="c-base" type="number" value={calcC.base} onChange={(e) => setCalcC({...calcC, base: e.target.value})} placeholder="1000" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                <label htmlFor="c-percent" className="text-xs font-bold text-slate-700 sm:text-right">Change</label>
                <div className="relative">
                  <input id="c-percent" type="number" value={calcC.percent} onChange={(e) => setCalcC({...calcC, percent: e.target.value})} placeholder="10" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                <label htmlFor="c-result" className="text-xs font-bold text-slate-700">Result</label>
                <div className="relative">
                  <input id="c-result" readOnly value={calcC.result} placeholder="—" className="w-full rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-blue-400 ring-1 ring-slate-200" />
                  <button aria-label="Copy result" onClick={() => copyToClipboard(calcC.result, setCalcC, calcC)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"><Copy size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={handleCalcC} className="inline-flex items-center gap-2 rounded-2xl bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"><Calculator size={16} /> Calculate</button>
                <p aria-live="polite" className={`text-xs font-medium ${getHintClass(calcC.tone)}`}>{calcC.hint}</p>
              </div>
            </div>
          </section>

          {/* Card D */}
          <section id="calc-d" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Percentage Change</h3>
                <p className="text-sm font-medium text-slate-500 italic">Old vs New = % difference?</p>
              </div>
              <span className="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-400 ring-1 ring-blue-100"><Activity size={18} /></span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto_1fr] sm:items-center">
                <label htmlFor="d-old" className="text-xs font-bold text-slate-700">Old</label>
                <input id="d-old" type="number" value={calcD.old} onChange={(e) => setCalcD({...calcD, old: e.target.value})} placeholder="1000" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                <label htmlFor="d-new" className="text-xs font-bold text-slate-700 sm:text-right">New</label>
                <input id="d-new" type="number" value={calcD.new} onChange={(e) => setCalcD({...calcD, new: e.target.value})} placeholder="1200" className="w-full rounded-2xl bg-white px-3 py-2.5 text-sm font-medium ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                <label htmlFor="d-result" className="text-xs font-bold text-slate-700">Result</label>
                <div className="relative">
                  <input id="d-result" readOnly value={calcD.result} placeholder="—" className="w-full rounded-2xl bg-slate-50 px-3 py-2.5 text-sm font-bold text-blue-400 ring-1 ring-slate-200" />
                  <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  <button aria-label="Copy result" onClick={() => copyToClipboard(calcD.result, setCalcD, calcD)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"><Copy size={14} /></button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={handleCalcD} className="inline-flex items-center gap-2 rounded-2xl bg-blue-400 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"><Calculator size={16} /> Calculate</button>
                <p aria-live="polite" className={`text-xs font-medium ${getHintClass(calcD.tone)}`}>{calcD.hint}</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-400 text-white"><Percent size={14} /></span>
            <div>
              <div className="text-sm font-bold text-slate-900">Percentage Calculator</div>
              <div className="text-xs text-slate-500">© {currentYear}</div>
            </div>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-400 transition-colors">
            <ArrowUp size={16} /> Back to Top
          </a>
        </div>
      </footer>
    </div>
  );
}