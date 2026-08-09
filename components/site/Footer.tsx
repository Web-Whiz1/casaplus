'use client';
import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLang } from '@/lib/i18n';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-lux py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-3xl text-white">Casa<span className="text-gold">Plus</span></div>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">{t('footer.desc')}</p>
          <div className="flex flex-col gap-3 mt-6">
            <a href="https://www.instagram.com/casaplusagentie/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors">
              <Instagram size={18} /> Instagram
            </a>
            <a href="https://www.tiktok.com/@casaplus35" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.8a4.85 4.85 0 01-3.77-1.23V6.69h3.77z" fill="white"/></svg>
              TikTok
            </a>
            <a href="https://www.facebook.com/casaplusiasi" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-gold transition-colors">
              <Facebook size={18} /> Facebook
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-gold mb-6">{t('footer.nav')}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-gold transition-colors">{t('nav.home')}</Link></li>
            <li><Link href="/properties" className="hover:text-gold transition-colors">{t('nav.properties')}</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">{t('nav.about')}</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-gold mb-6">{t('footer.contact')}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-gold" /><span>Bulevardul Ștefan cel Mare și Sfânt 4<br/>Iași, România</span></li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-gold" /><a href="tel:+40743864000" className="hover:text-gold">Gabriel — +40 743 864 000</a></li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-gold" /><a href="tel:+40787860899" className="hover:text-gold">Alex — +40 787 860 899</a></li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-gold" /><a href="mailto:casaplusiasi@gmail.com" className="hover:text-gold">casaplusiasi@gmail.com</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.28em] text-gold mb-6">{t('footer.legal')}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/legal/privacy" className="hover:text-gold transition-colors">{t('legal.privacy')}</Link></li>
            <li><Link href="/legal/terms" className="hover:text-gold transition-colors">{t('legal.terms')}</Link></li>
            <li><Link href="/legal/gdpr" className="hover:text-gold transition-colors">{t('legal.gdpr')}</Link></li>
          </ul>
          <div className="flex flex-col gap-2 mt-6">
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="nofollow noopener" className="block">
              <img src="https://layouth.ro/wp-content/uploads/resurse-publice/anpc-sal-mare.png" alt="Soluționarea Alternativă a Litigiilor" title="Soluționarea Alternativă a Litigiilor" className="w-[250px] h-auto object-contain" />
            </a>
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow noopener" className="block">
              <img src="https://layouth.ro/wp-content/uploads/resurse-publice/anpc-sol-mare.png" alt="Soluționarea Online a Litigiilor" title="Soluționarea Online a Litigiilor" className="w-[250px] h-auto object-contain" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-lux py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/50">
          <div>© 2026 CasaPlus</div>
          <div>{t('footer.rights')}</div>
        </div>
      </div>
    </footer>
  );
}
