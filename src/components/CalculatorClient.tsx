"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ChevronRight, Percent, Sun, Moon, Linkedin, Twitter, Facebook } from "lucide-react";
import "@/app/calculator.css";

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
  const { cardA, cardB, cardC, cardD } = ui;

  const [calcA, setCalcA] = useState({ percent: "", total: "", result: "" });
  const [calcB, setCalcB] = useState({ value: "", total: "", result: "" });
  const [calcC, setCalcC] = useState({ base: "", percent: "", result: "" });
  const [calcD, setCalcD] = useState({ old: "", new: "", result: "" });

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    // 1. If user has manually chosen a theme before, always respect that
    const saved = localStorage.getItem("calc-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      setMounted(true);
      return;
    }

    // 2. Auto-detect: use local time to decide dark vs light
    //    Dark hours = 19:00 (7pm) → 06:59 (6:59am) in the user's local timezone
    //    This works for any region automatically because Date() uses the device's local time
    const hour = new Date().getHours(); // 0–23 in local time
    const isNightTime = hour >= 19 || hour < 7;

    // 3. Also consider OS-level dark mode preference as a tiebreaker for daytime
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(isNightTime || prefersDark ? "dark" : "light");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    // Only persist if user manually toggled — handled by toggleTheme below
  }, [theme, mounted]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    // Save manual preference so auto-detect doesn't override on next visit
    localStorage.setItem("calc-theme", next);
  };

  const runCalcA = () => {
    const p = parseFloat(calcA.percent);
    const t = parseFloat(calcA.total);
    if (isNaN(p) || isNaN(t)) { setCalcA({ ...calcA, result: "" }); return; }
    setCalcA({ ...calcA, result: ((p / 100) * t).toLocaleString() });
  };

  const runCalcB = () => {
    const v = parseFloat(calcB.value);
    const t = parseFloat(calcB.total);
    if (isNaN(v) || isNaN(t)) { setCalcB({ ...calcB, result: "" }); return; }
    if (t === 0) { setCalcB({ ...calcB, result: "" }); return; }
    setCalcB({ ...calcB, result: ((v / t) * 100).toFixed(2) });
  };

  const runCalcC = () => {
    const b = parseFloat(calcC.base);
    const p = parseFloat(calcC.percent);
    if (isNaN(b) || isNaN(p)) { setCalcC({ ...calcC, result: "" }); return; }
    setCalcC({ ...calcC, result: (b * (1 + p / 100)).toLocaleString() });
  };

  const runCalcD = () => {
    const o = parseFloat(calcD.old);
    const n = parseFloat(calcD.new);
    if (isNaN(o) || isNaN(n)) { setCalcD({ ...calcD, result: "" }); return; }
    if (o === 0) { setCalcD({ ...calcD, result: "" }); return; }
    setCalcD({ ...calcD, result: (((n - o) / o) * 100).toFixed(2) });
  };

  // Auto-calculation hooks
  useEffect(() => { runCalcA(); }, [calcA.percent, calcA.total]);
  useEffect(() => { runCalcB(); }, [calcB.value, calcB.total]);
  useEffect(() => { runCalcC(); }, [calcC.base, calcC.percent]);
  useEffect(() => { runCalcD(); }, [calcD.old, calcD.new]);

  if (!mounted) return null;

  const inputClass =
    "outline-none w-full p-3 text-md font-semibold rounded shadow-sm no-spinner transition-all" +
    " bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--input-text)]" +
    " focus:border-blue-400 focus:ring-4 focus:ring-[var(--focus-ring)]";

  const labelClass = "mb-2 text-base md:text-lg font-semibold text-[var(--label-text)]";

  return (
    <div className="cr">

      {/* ═══ HEADER ═══ */}
      <header className="cr-header py-4 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href={`/${locale}`} className="flex items-center gap-3 no-underline">
            <div className="bg-blue-400 p-2 rounded shadow-lg">
              <Percent size={24} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="logo-title text-lg sm:text-xl uppercase leading-none tracking-tight">
                {locale === "fr" ? "Calculer Le Pourcentage" : "Calculate Percentage"}
              </span>
              <span className="logo-sub text-[10px] font-bold uppercase tracking-widest mt-1">
                {locale === "fr" ? "calculer un pourcentage" : "percent math tool"}
              </span>
            </div>
          </a>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1">
        <div className="mx-auto mt-10 w-full max-w-5xl px-4 space-y-10">

          {/* Hero banner */}
          <div className="cr-banner border-l-4 border-blue-400 rounded shadow-sm px-6 py-4">
            <p>
              {locale === "fr"
                ? "Le calculateur de pourcentage est un outil en ligne gratuit pour calculer un pourcentage."
                : "Percentage Calculator is a free online tool to calculate percentages."}
            </p>
          </div>

          {/* ─── Card A: Percent → Number ─── */}
          <section className="cr-card rounded-xl border-2 p-5 sm:p-10 shadow-md relative">
            <h2 className="mb-6 text-md lg:text-xl border-b-2 pb-2 capitalize">{cardA.title}</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
                <span className={labelClass}>{cardA.labelValue}</span>
                <div className="w-[35%] sm:w-32 shrink-0 relative">
                  <input
                    type="number" value={calcA.percent}
                    onChange={e => setCalcA({ ...calcA, percent: e.target.value })}
                    className={`${inputClass} pr-7 sm:pr-8`}
                  />
                  <span className="input-suffix absolute right-2 top-1/2 -translate-y-1/2 font-semibold text-sm pointer-events-none">%</span>
                </div>
                <span className={labelClass}>{cardA.labelTotal}</span>
                <div className="w-[30%] sm:w-48 shrink-0">
                  <input
                    type="number" value={calcA.total}
                    onChange={e => setCalcA({ ...calcA, total: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
                <button onClick={runCalcA} className="w-full lg:w-48 flex items-center justify-center gap-2 rounded bg-blue-400 py-4 text-lg font-bold uppercase text-white shadow-xl active:scale-95 hover:bg-blue-500 transition-all">
                  {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
                </button>
                <div className="result-box w-full lg:w-48 border-2 py-3 text-2xl font-bold text-center rounded shadow-inner">
                  {calcA.result || "---"}
                </div>
              </div>
            </div>
          </section>

          {/* ─── Card B: Number → Percent ─── */}
          <section className="cr-card rounded-xl border-2 p-6 sm:p-10 relative">
            <h2 className="mb-6 text-md lg:text-xl border-b-2 pb-2 capitalize">{cardB.title}</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex flex-row items-center gap-3 flex-1">
                <div className="w-24 sm:w-32">
                  <input
                    type="number" value={calcB.value}
                    onChange={e => setCalcB({ ...calcB, value: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <span className={labelClass}>{cardB.labelTotal}</span>
                <div className="flex-1 lg:flex-initial lg:w-48">
                  <input
                    type="number" value={calcB.total}
                    onChange={e => setCalcB({ ...calcB, total: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
                <button onClick={runCalcB} className="w-full lg:w-48 flex items-center justify-center gap-2 rounded bg-blue-400 py-4 text-lg font-bold uppercase text-white shadow-xl active:scale-95 hover:bg-blue-500 transition-all">
                  {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
                </button>
                <div className="result-box w-full lg:w-48 border-2 py-3 text-2xl font-bold text-center rounded shadow-inner flex items-center justify-center gap-1">
                  {calcB.result || "---"} <span className="text-lg font-bold">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Card D: Percentage Change ─── */}
          <section className="cr-card rounded-xl border-2 p-6 sm:p-10 relative">
            <h2 className="mb-6 text-md lg:text-xl border-b-2 pb-2 capitalize">{cardD.title}</h2>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex flex-row items-center gap-3 flex-1">
                <span className={labelClass}>{cardD.labelOld}</span>
                <div className="flex-1">
                  <input
                    type="number" value={calcD.old}
                    onChange={e => setCalcD({ ...calcD, old: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <span className={labelClass}>{cardD.labelNew}</span>
                <div className="flex-1">
                  <input
                    type="number" value={calcD.new}
                    onChange={e => setCalcD({ ...calcD, new: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
                <button onClick={runCalcD} className="w-full lg:w-48 flex items-center justify-center gap-2 rounded bg-blue-400 py-4 text-lg font-bold uppercase text-white shadow-xl transition-all hover:bg-blue-500">
                  {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
                </button>
                <div className="result-box w-full lg:w-48 border-2 py-3 text-2xl font-bold text-center rounded shadow-inner flex items-center justify-center gap-1">
                  {calcD.result || "---"} <span className="text-lg font-bold">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Card C: Increase / Decrease ─── */}
          <section className="cr-card rounded-xl border-2 p-5 sm:p-10 shadow-md relative">
            <h2 className="mb-4 text-md lg:text-xl border-b-2 pb-2 capitalize tracking-tight">{cardC.title}</h2>
            <p className={labelClass}>{cardC.labelBase}</p>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex flex-row items-center gap-3 flex-1 min-w-0">
                <div className="w-[50%] sm:w-44 shrink-0">
                  <input
                    type="number" value={calcC.base}
                    onChange={e => setCalcC({ ...calcC, base: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold uppercase shrink-0 text-[var(--text-body)]">{cardC.labelChange}</span>
                <div className="w-[35%] sm:w-32 shrink-0 relative">
                  <input
                    type="number" value={calcC.percent}
                    onChange={e => setCalcC({ ...calcC, percent: e.target.value })}
                    className={inputClass}
                  />
                  <span className="input-suffix absolute right-2 top-1/2 -translate-y-1/2 font-semibold text-sm pointer-events-none">%</span>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto relative">
                <button onClick={runCalcC} className="w-full lg:w-48 flex items-center justify-center gap-3 rounded bg-blue-400 py-4 text-lg font-bold uppercase tracking-tighter text-white shadow-xl hover:bg-blue-500 active:scale-95 transition-all">
                  {ui.calculate} <ChevronRight size={22} strokeWidth={4} />
                </button>
                <div className="result-box w-full lg:w-48 border-2 p-3.5 text-2xl font-bold text-center rounded shadow-inner">
                  {calcC.result || "---"}
                </div>
              </div>
            </div>
          </section>

        </div>{/* end calc cards */}

        {/* ═══ SEO CONTENT ═══ */}
        <div className="cr-seo mt-20 border-t-4 pt-16 pb-12 px-4">
          <div className="max-w-5xl mx-auto space-y-16">

            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold leading-[1.1] mb-8 capitalize tracking-tight">{seo.h1}</h2>
              <p className="font-medium leading-relaxed border-l-4 border-blue-400 pl-6">{seo.intro}</p>
            </div>

            <div className="seo-howto-card border-2 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">{seo.howTo.title}</h3>
              <p className="text-md font-medium mb-4">{seo.howTo.content}</p>
              <div className="bg-slate-900 p-6 rounded shadow-lg mb-4">
                <code className="text-blue-400 font-medium text-xl sm:text-2xl block text-center">
                  {seo.howTo.formula}
                </code>
              </div>
              <p className="text-md font-medium">{seo.howTo.example}</p>
            </div>

            {/* Examples */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center capitalize tracking-tight">{seo.examples.title}</h3>
              <div className="grid gap-6 md:grid-cols-3">
                {seo.examples.items.map((item: any, idx: number) => (
                  <div key={idx} className="example-card p-6 rounded-xl border-2 shadow-sm transition-all hover:border-blue-300">
                    <h3 className="font-bold text-blue-400 mb-3 text-lg">{item.title}</h3>
                    <p className="text-sm font-medium leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div id="faq" className="max-w-4xl mx-auto space-y-12">
              <h2 className="text-3xl font-bold text-center uppercase tracking-tight">FAQ</h2>
              <div className="space-y-6">
                {seo.faq.map((item: any, idx: number) => (
                  <div key={idx} className="faq-card p-6 sm:p-8 rounded-xl border-2 shadow-sm hover:border-blue-200 transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-400 text-white text-sm font-bold shadow-md">?</span>
                      <p className="font-bold text-lg sm:text-xl leading-tight pt-1">{item.question}</p>
                    </div>
                    <p className="font-medium leading-relaxed pl-14">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="cr-footer">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-6">&copy; {currentYear} {seo.h1.split(" ")[0]} Calc</p>
          <div className="flex justify-center gap-10 text-xs font-bold uppercase mb-8">
            <a href={`/${locale}/privacy`} className="hover:text-white transition-colors">{ui.privacyPolicy}</a>
            <a href={`/${locale}/terms`} className="hover:text-white transition-colors">{ui.termsOfService}</a>
          </div>
          <div className="flex justify-center gap-6 mb-10">
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://calculerlepourcentage.fr`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-slate-800 hover:bg-blue-600 text-white transition-all shadow-lg"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?url=https://calculerlepourcentage.fr&text=${encodeURIComponent(seo.h1)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-slate-800 hover:bg-sky-500 text-white transition-all shadow-lg"
              aria-label="Share on Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=https://calculerlepourcentage.fr`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-slate-800 hover:bg-blue-700 text-white transition-all shadow-lg"
              aria-label="Share on Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>

          <div className="border-t border-slate-800 pt-8 max-w-md mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-400">Contact & Feedback</p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `mailto:emailmirzamustafa@gmail.com?subject=Feedback from Percentage Calculator&body=From: ${contactEmail}%0D%0A%0D%0AMessage: ${contactMessage}`;
              }}
              className="space-y-3"
            >
              <input 
                type="email" 
                placeholder="Your Email" 
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 text-sm rounded bg-slate-800 border border-slate-700 text-white focus:border-blue-400 outline-none transition-all"
              />
              <textarea 
                placeholder="Your Message" 
                required
                rows={3}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full p-2.5 text-sm rounded bg-slate-800 border border-slate-700 text-white focus:border-blue-400 outline-none transition-all resize-none"
              />
              <button 
                type="submit"
                className="w-full py-2.5 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-10 right-10 h-16 w-16 flex items-center justify-center rounded-full bg-blue-400 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-50"
      >
        <ArrowUp size={28} strokeWidth={4} />
      </button>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": seo.faq.map((item: any) => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
          })
        }}
      />
    </div>
  );
}