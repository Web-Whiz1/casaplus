'use client';
import { useLang, Lang } from '@/lib/i18n';

export function LanguageToggle({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang, setLang } = useLang();
  const base = variant === 'dark' ? 'text-ink' : 'text-white';
  const off = variant === 'dark' ? 'text-muted' : 'text-white/50';

  const Btn = ({ code, label }: { code: Lang; label: string }) => (
    <button
      onClick={() => setLang(code)}
      className={`text-[11px] uppercase tracking-[0.24em] transition-colors ${lang === code ? `${base} font-medium` : `${off} hover:text-gold`}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <Btn code="ro" label="RO" />
      <span className={`${off}`}>/</span>
      <Btn code="en" label="EN" />
    </div>
  );
}
