'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const { t } = useLang();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const solid = scrolled || !isHome;

  const nav = [
    { href: '/', k: 'nav.home' },
    { href: '/properties', k: 'nav.properties' },
    { href: '/about', k: 'nav.about' },
    { href: '/contact', k: 'nav.contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-out ${solid ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-line' : 'bg-transparent'}`}>
        <div className="container-lux flex items-center justify-between h-20 md:h-24">
          <Link href="/" className="group flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className={`font-display text-2xl md:text-[28px] tracking-tight transition-all duration-700 ease-out ${solid ? 'text-ink' : 'text-white'}`}>Casa<span className="text-gold">Plus</span></span>
              <span className={`text-[9px] uppercase tracking-[0.3em] mt-1 transition-all duration-700 ease-out ${solid ? 'text-muted' : 'text-white/70'}`}>Real Estate — Iași</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {nav.map(n => (
              <Link key={n.href} href={n.href} className={`text-[13px] uppercase tracking-[0.18em] link-underline transition-all duration-700 ease-out ${solid ? 'text-ink hover:text-gold' : 'text-white/90 hover:text-white'}`}>
                {t(n.k)}
              </Link>
            ))}
            <LanguageToggle variant={solid ? 'dark' : 'light'} />
          </nav>

          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-line transition-all duration-300 ease-out active:scale-90"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="text-ink" size={22} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] bg-ink flex flex-col" role="dialog" aria-modal="true">
          <div className="container-lux flex items-center justify-between h-20">
            <span className="font-display text-2xl text-white">Casa<span className="text-gold">Plus</span></span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 transition-all duration-300 ease-out active:scale-90"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center container-lux">
            {nav.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-4 py-5 text-3xl md:text-4xl font-display text-white hover:text-gold transition-colors duration-300 border-b border-white/10 last:border-b-0"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-[11px] uppercase tracking-[0.25em] text-white/40 group-hover:text-gold transition-colors duration-300 w-8">0{i + 1}</span>
                {t(n.k)}
              </Link>
            ))}
            <div className="mt-10 pt-8 border-t border-white/10">
              <LanguageToggle variant="light" />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
