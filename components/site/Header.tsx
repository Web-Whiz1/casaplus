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
    window.addEventListener('scroll', on);
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  // On non-home pages, always use the "solid/dark" style
  const solid = scrolled || !isHome;

  const nav = [
    { href: '/', k: 'nav.home' },
    { href: '/properties', k: 'nav.properties' },
    { href: '/about', k: 'nav.about' },
    { href: '/contact', k: 'nav.contact' },
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${solid ? 'bg-canvas/95 backdrop-blur-md border-b border-line' : 'bg-transparent'}`}>
      <div className="container-lux flex items-center justify-between h-20 md:h-24">
        <Link href="/" className="group">
          <div className="flex flex-col leading-none">
            <span className={`font-display text-2xl md:text-[28px] tracking-tight ${solid ? 'text-ink' : 'text-white'}`}>Casa<span className="text-gold">Plus</span></span>
            <span className={`text-[9px] uppercase tracking-[0.3em] mt-1 ${solid ? 'text-muted' : 'text-white/70'}`}>Real Estate — Iași</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className={`text-[13px] uppercase tracking-[0.18em] link-underline transition-colors ${solid ? 'text-ink hover:text-gold' : 'text-white/90 hover:text-white'}`}>
              {t(n.k)}
            </Link>
          ))}
          <LanguageToggle variant={solid ? 'dark' : 'light'} />
        </nav>

        <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
          <Menu className={solid ? 'text-ink' : 'text-white'} size={26} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-canvas flex flex-col">
          <div className="container-lux flex items-center justify-between h-20">
            <span className="font-display text-2xl">Casa<span className="text-gold">Plus</span></span>
            <button onClick={() => setOpen(false)} aria-label="Close"><X size={26} /></button>
          </div>
          <div className="flex-1 flex flex-col justify-center container-lux gap-6">
            {nav.map(n => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display text-4xl text-ink hover:text-gold transition-colors">
                {t(n.k)}
              </Link>
            ))}
            <div className="mt-8"><LanguageToggle variant="dark" /></div>
          </div>
        </div>
      )}
    </header>
  );
}
