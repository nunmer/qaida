"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  LANGUAGES,
  TRANSLATIONS,
  type Language,
  type Translations,
} from "@/lib/translations";

const STORAGE_KEY = "qaida.lang";
const DEFAULT_LANGUAGE: Language = "kk";

interface I18nValue {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nValue>({
  lang: DEFAULT_LANGUAGE,
  t: TRANSLATIONS[DEFAULT_LANGUAGE],
  setLang: () => undefined,
});

function isLanguage(value: string | null): value is Language {
  return value === "kk" || value === "en" || value === "ru";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Render the default (Kazakh) on the server and first client paint, then
  // adopt the stored choice — avoids a hydration mismatch.
  const [lang, setLangState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(stored)) setLangState(stored);
    } catch {
      // storage unavailable (private mode) — keep the default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable — the choice just won't persist
    }
  };

  return (
    <I18nContext.Provider value={{ lang, t: TRANSLATIONS[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`flex gap-1 rounded-full border border-border-subtle bg-surface/70 p-1 backdrop-blur ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`rounded-full px-2.5 py-1 font-display text-[0.65rem] font-bold tracking-wider transition ${
            lang === code
              ? "bg-accent text-background"
              : "text-muted hover:text-foreground"
          }`}
          aria-pressed={lang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
