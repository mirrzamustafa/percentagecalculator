"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Percent, Sun, Moon, Linkedin, Twitter, Facebook, ChevronRight } from "lucide-react";
import "@/app/calculator.css";

interface Props {
  locale: string;
  title: string;
  content: React.ReactNode;
  translations: any;
}

export default function LegalPage({ locale, title, content, translations }: Props) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    // Respect saved manual preference first
    const saved = localStorage.getItem("calc-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      setMounted(true);
      return;
    }

    // Auto-detect by time (19:00–06:59 = dark) + OS preference
    const hour = new Date().getHours();
    const isNightTime = hour >= 19 || hour < 7;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isNightTime || prefersDark ? "dark" : "light");
    setMounted(true);

    // Live check every minute to switch theme if time passes thresholds
    const interval = setInterval(() => {
      if (localStorage.getItem("calc-theme")) return; // Don't override manual choice
      const h = new Date().getHours();
      const night = h >= 19 || h < 7;
      setTheme(night ? "dark" : "light");
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("calc-theme", next);
  };

  if (!mounted) return null;

  return (
    <div className="legal-root">

      {/* ═══ HEADER ═══ */}
      <header className="legal-header py-4 sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href={`/${locale}`} className="flex items-center gap-3 no-underline">
            <div className="bg-blue-400 p-2 rounded shadow-lg shrink-0">
              <Percent size={24} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="logo-title text-lg sm:text-xl uppercase leading-none tracking-tight">
                {locale === "fr" ? "Calculer Le Pourcentage" : translations.ui?.headerTitle || "Calculate Percentage"}
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
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 sm:px-6">
        <div className="legal-card p-8 sm:p-12 shadow-md">
          <h2 className="text-3xl mb-8">{title}</h2>
          <div className="leading-relaxed space-y-6">
            {content}
          </div>
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="cr-footer">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-6">
            &copy; {currentYear} {translations.seo.h1.split(" ")[0]} Calc
          </p>
          <div className="flex justify-center gap-10 text-xs font-bold uppercase mb-8">
            <a href={`/${locale}/privacy`} className="transition-colors">{translations.ui.privacyPolicy}</a>
            <a href={`/${locale}/terms`} className="transition-colors">{translations.ui.termsOfService}</a>
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
              href={`https://twitter.com/intent/tweet?url=https://calculerlepourcentage.fr&text=${encodeURIComponent(translations.seo.h1)}`} 
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

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-10 right-10 h-16 w-16 flex items-center justify-center rounded-full bg-blue-400 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-50"
      >
        <ArrowUp size={28} strokeWidth={4} />
      </button>
    </div>
  );
}