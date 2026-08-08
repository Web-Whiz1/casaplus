'use client';
import { MapPin, Phone, Clock, Instagram, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function ContactPage() {
  const { t } = useLang();

  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Pia%C8%9Ba+Unirii+2+Ia%C8%99i';

  return (
    <>
      <section className="page-hero">
        <div className="container-lux max-w-4xl">
          <div className="eyebrow mb-4">CasaPlus — Iași</div>
          <h1 className="page-hero-title">{t('contact.title')}</h1>
          <p className="page-subtitle text-xl max-w-2xl">{t('contact.lead')}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-line">
        <div className="container-lux grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="border border-line bg-white p-8">
            <div className="flex items-center gap-2 text-gold mb-4"><MapPin size={18} /><span className="eyebrow">{t('contact.address')}</span></div>
            <div className="text-ink leading-relaxed">
              <div>Strada Eternitate nr. 30</div>
              <div>Iași, România</div>
              <div className="mt-4">Birou: Piața Unirii nr. 2</div>
              <div>Iași, România</div>
            </div>
          </div>
          <div className="border border-line bg-white p-8">
            <div className="flex items-center gap-2 text-gold mb-4"><Phone size={18} /><span className="eyebrow">{t('contact.phones')}</span></div>
            <div className="text-ink leading-relaxed space-y-2">
              <div>
                <a href="tel:+40743864000" className="block hover:text-gold font-medium">+40 743 864 000</a>
                <span className="text-[11px] text-muted uppercase tracking-[0.2em]">Gabriel</span>
              </div>
              <div>
                <a href="tel:+40787860899" className="block hover:text-gold font-medium">+40 787 860 899</a>
                <span className="text-[11px] text-muted uppercase tracking-[0.2em]">Alex</span>
              </div>
            </div>
          </div>
          <div className="border border-line bg-white p-8">
            <div className="flex items-center gap-2 text-gold mb-4"><Clock size={18} /><span className="eyebrow">{t('contact.schedule')}</span></div>
            <div className="text-ink leading-relaxed whitespace-pre-line">{t('contact.schedule.body')}</div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-lux grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-2">Gabriel</div>
            <a href="tel:+40743864000" className="btn-gold w-full justify-center"><Phone size={16} /> +40 743 864 000</a>
            <a href="https://wa.me/40743864000" target="_blank" rel="noopener" className="btn-outline w-full justify-center">WhatsApp</a>
          </div>
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted mb-2">Alex</div>
            <a href="tel:+40787860899" className="btn-gold w-full justify-center"><Phone size={16} /> +40 787 860 899</a>
            <a href="https://wa.me/40787860899" target="_blank" rel="noopener" className="btn-outline w-full justify-center">WhatsApp</a>
          </div>
        </div>
        <div className="container-lux flex flex-wrap gap-4 mt-8">
          <a href={mapsUrl} target="_blank" rel="noopener" className="btn-outline"><MapPin size={16} /> {t('contact.openMaps')}</a>
          <a href="https://www.instagram.com/casaplusagentie/" target="_blank" rel="noopener" className="btn-outline"><Instagram size={16} /> Instagram</a>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-lux">
          <div className="aspect-[21/9] w-full border border-line overflow-hidden shadow-soft">
            <iframe
              src="https://www.google.com/maps?q=Pia%C8%9Ba+Unirii+2+Ia%C8%99i&output=embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="CasaPlus — Piața Unirii 2, Iași"
            />
          </div>
        </div>
      </section>
    </>
  );
}
