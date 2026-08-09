'use client';
import Link from 'next/link';
import { Instagram, Phone, MapPin } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-ink text-white/80">
      <div className="container-lux py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-3xl text-white">Casa<span className="text-gold">Plus</span></div>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">{t('footer.desc')}</p>
          <a href="https://www.instagram.com/casaplusagentie/" target="_blank" rel="noopener" className="inline-flex items-center gap-2 mt-6 text-sm text-white/70 hover:text-gold transition-colors">
            <Instagram size={18} /> @casaplusagentie
          </a>
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
