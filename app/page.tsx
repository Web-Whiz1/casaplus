'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { PropertyCard } from '@/components/site/PropertyCard';
import { Property } from '@/lib/types';

export default function HomePage() {
  const { t } = useLang();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/properties?featured=1')
      .then(r => r.json())
      .then(d => { if (d?.data?.length) setProperties(d.data.slice(0, 4)); })
      .catch(() => {});
  }, []);

  const stats = [
    { n: '2013', l: t('stats.year') },
    { n: '1000+', l: t('stats.clients') },
    { n: '500+', l: t('stats.properties') },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[640px] md:min-h-screen w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=2400&q=85"
          alt="Luxury home in Iași"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/20" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/75" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(168,132,63,0.30),transparent_24%)]" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[640px] md:min-h-screen items-center">
          <div className="container-lux py-28 md:py-40">
            <div className="max-w-3xl">
              <div className="text-[11px] uppercase tracking-[0.34em] text-gold mb-6">Casa Plus — Plus de Confort, Plus de Calitate</div>
              <h1 className="font-display text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] text-5xl md:text-7xl lg:text-[88px] leading-[0.94] text-balance">
                {t('hero.headline')}
              </h1>
              <p className="mt-8 text-white/85 text-lg md:text-xl max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/properties" className="btn-gold">{t('hero.cta.primary')} <ArrowRight size={16} /></Link>
                <Link href="/contact" className="btn-ghost">{t('hero.cta.secondary')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-canvas py-24 md:py-32">
        <div className="container-lux">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-y border-line py-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-5xl md:text-6xl text-ink leading-none">{s.n}</div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.24em] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="section-shell">
        <div className="container-lux">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="eyebrow mb-4">{t('featured.eyebrow')}</div>
              <h2 className="section-title max-w-2xl">{t('featured.title')}</h2>
              <p className="mt-4 text-muted max-w-lg">{t('featured.subtitle')}</p>
            </div>
            <Link href="/properties" className="hidden md:inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.2em] text-ink link-underline hover:text-gold">
              {t('featured.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {properties.slice(0, 4).map((p, i) => (
              <PropertyCard key={p.id} property={p} priority={i < 2} />
            ))}
          </div>

          <div className="mt-16 md:hidden text-center">
            <Link href="/properties" className="btn-outline">{t('featured.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* WHY CASAPLUS */}
      <section className="bg-white py-24 md:py-32 border-y border-line">
        <div className="container-lux">
          <div className="max-w-2xl mb-16">
            <div className="eyebrow mb-4">{t('why.eyebrow')}</div>
            <h2 className="section-title">{t('why.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[1,2,3].map(i => (
              <div key={i} className="reason-card">
                <div className="font-display text-6xl text-gold/30 leading-none">0{i}</div>
                <h3 className="font-display text-2xl mt-6 text-ink leading-tight">{t(`why.${i}.title`)}</h3>
                <p className="mt-4 text-muted leading-relaxed">{t(`why.${i}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="section-shell">
        <div className="container-lux grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1600&q=85"
              alt="CasaPlus office"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:pl-2">
            <div className="eyebrow mb-4">{t('about.preview.eyebrow')}</div>
            <h2 className="section-title text-balance">{t('about.preview.title')}</h2>
            <p className="mt-8 text-muted text-lg leading-relaxed">{t('about.preview.body')}</p>
            <div className="mt-10">
              <Link href="/about" className="btn-outline">{t('about.preview.cta')} <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA CONTACT */}
      <section className="relative py-24 md:py-40 overflow-hidden bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8?w=2000&q=80"
          alt=""
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 to-ink/80" />
        <div className="container-lux relative text-center">
          <h2 className="font-display text-4xl md:text-6xl text-white text-balance max-w-3xl mx-auto leading-[1.03]">{t('cta.contact.title')}</h2>
          <p className="mt-6 text-white/70 text-lg max-w-xl mx-auto">{t('cta.contact.body')}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="tel:+40743864000" className="btn-gold"><Phone size={16} /> Gabriel — +40 743 864 000</a>
            <a href="https://wa.me/40743864000" target="_blank" rel="noopener" className="btn-ghost">WhatsApp Gabriel</a>
            <a href="tel:+40787860899" className="btn-gold"><Phone size={16} /> Alex — +40 787 860 899</a>
            <a href="https://wa.me/40787860899" target="_blank" rel="noopener" className="btn-ghost">WhatsApp Alex</a>
          </div>
        </div>
      </section>
    </>
  );
}
