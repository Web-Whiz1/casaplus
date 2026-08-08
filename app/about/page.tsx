'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLang();

  return (
    <>
      <section className="page-hero">
        <div className="container-lux max-w-4xl">
          <div className="eyebrow mb-4">CasaPlus — Est. 2013</div>
          <h1 className="page-hero-title text-balance">{t('about.title')}</h1>
          <p className="page-subtitle text-xl">{t('about.lead')}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-lux">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[2px] shadow-soft">
            <Image src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=2400&q=85" alt="CasaPlus" fill className="object-cover" sizes="100vw" priority />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-line">
        <div className="container-lux grid grid-cols-1 md:grid-cols-3 gap-16">
          {['mission', 'vision', 'values'].map((k) => (
            <div key={k} className="bg-white border border-line p-8">
              <div className="eyebrow mb-4">{t(`about.${k}.title`)}</div>
              <h3 className="font-display text-3xl text-ink mb-4 leading-tight">{t(`about.${k}.title`)}</h3>
              <p className="text-muted leading-relaxed">{t(`about.${k}.body`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white border-y border-line">
        <div className="container-lux grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="eyebrow mb-4">CASAPLUS</div>
            <h2 className="section-title">{t('about.cta.title')}</h2>
            <div className="mt-8 space-y-3 text-muted">
              <div className="text-ink font-medium">{t('about.cta.subtitle')}</div>
            </div>
            <div className="mt-10">
              <Link href="/contact" className="btn-outline">{t('nav.contact')} <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] shadow-soft">
            <Image src="https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?w=1600&q=85" alt="Interior premium" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>
    </>
  );
}
