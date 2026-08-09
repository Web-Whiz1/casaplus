'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Maximize2, BedDouble, Bath, Building2, Calendar, Flame, Car, Trees, Package, Phone, Share2, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang, formatPrice } from '@/lib/i18n';
import { isValidTranslation } from '@/lib/translation-utils';
import { PropertyCard } from '@/components/site/PropertyCard';
import { Property } from '@/lib/types';
import { toast } from 'sonner';

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, lang } = useLang();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/properties/${slug}`).then(r => {
      if (!r.ok) throw new Error('not found');
      return r.json();
    }).then(d => {
      setProperty(d?.data || null);
    }).catch(() => {
      setProperty(null);
    }).finally(() => {
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!property) return;
    fetch('/api/properties')
      .then(r => r.json())
      .then(d => {
        const all = d?.data || [];
        setSimilar(all.filter((p: Property) => p.id !== property.id && p.type === property.type).slice(0, 3));
      })
      .catch(() => {});
  }, [property?.id, property?.type]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') setLightbox((lightbox - 1 + property.gallery.length + 1) % (property.gallery.length + 1));
      if (e.key === 'ArrowRight') setLightbox((lightbox + 1) % (property.gallery.length + 1));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, property?.gallery?.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <div className="text-muted text-sm uppercase tracking-[0.2em]">Se încarcă...</div>
      </div>
    );
  }

  if (!property) return notFound();

  const title = lang === 'en' && isValidTranslation(property.title_en) ? property.title_en : property.title;
  const description = lang === 'en' && isValidTranslation(property.description_en) ? property.description_en : property.description;

  const features = [
    { icon: Maximize2, label: t('feat.area'), value: `${property.area} m²` },
    { icon: BedDouble, label: t('feat.rooms'), value: property.rooms },
    { icon: Bath, label: t('feat.bathrooms'), value: property.bathrooms },
    { icon: Building2, label: t('feat.floor'), value: property.floor || '—' },
    { icon: Calendar, label: t('feat.year'), value: property.year_built || '—' },
    { icon: Flame, label: t('feat.heating'), value: property.heating || '—' },
    { icon: Car, label: t('feat.parking'), value: property.parking ? t('yes') : t('no') },
    { icon: Trees, label: t('feat.balcony'), value: property.balcony ? t('yes') : t('no') },
    { icon: Package, label: t('feat.storage'), value: property.storage ? t('yes') : t('no') },
  ];

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(lang === 'ro' ? 'Link copiat' : 'Link copied');
    }
  };

  return (
    <>
      {/* HERO GALLERY */}
      <section className="pt-24">
        <div className="container-lux">
          <Link href="/properties" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-muted hover:text-gold mb-8">
            <ArrowLeft size={14} /> {t('nav.properties')}
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-3 h-[50vh] md:h-[75vh]">
            <button onClick={() => setLightbox(0)} className="col-span-2 row-span-2 relative overflow-hidden group">
              <Image src={property.cover_image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority sizes="60vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            {property.gallery.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setLightbox(i + 1)} className="relative overflow-hidden group hidden md:block">
                <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="20vw" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </button>
            ))}
            {property.gallery.length > 4 && (
              <button onClick={() => setLightbox(4)} className="relative overflow-hidden group hidden md:flex items-center justify-center bg-black/60 hover:bg-black/40 transition-colors">
                <div className="text-center text-white">
                  <div className="text-2xl font-display">+{property.gallery.length - 4}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mt-1">Foto</div>
                </div>
              </button>
            )}
          </div>
          <div className="mt-3 text-[11px] text-muted uppercase tracking-[0.2em]">
            {property.gallery.length + 1} fotografii
          </div>
        </div>
      </section>

      {/* HEAD */}
      <section className="py-16 md:py-24">
        <div className="container-lux grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted">
              <MapPin size={12} /> {property.location}
              <span className="text-gold ml-2">• {t(`status.${property.status}`)}</span>
              <span className="text-gold ml-2">• {t(`listing_type.${property.listing_type}`)}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-ink mt-4 text-balance leading-[1.05]">{title}</h1>
            <div className="mt-6 font-display text-3xl md:text-4xl text-gold">{formatPrice(property.price, property.currency, lang)}</div>

            <div className="mt-14">
              <div className="eyebrow mb-4">{t('detail.description')}</div>
              <p className="text-ink text-lg leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>

            <div className="mt-16">
              <div className="eyebrow mb-6">{t('detail.features')}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 border-t border-line pt-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <f.icon size={18} className="text-gold mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.24em] text-muted">{f.label}</div>
                      <div className="text-ink mt-1">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR / CTA */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="bg-white border border-line p-8">
              <div className="text-[11px] uppercase tracking-[0.24em] text-muted">CasaPlus Iași</div>
              <div className="font-display text-2xl mt-2 text-ink">{t('detail.cta.title')}</div>
              <p className="text-sm text-muted mt-3">{t('detail.cta.body')}</p>

              <div className="mt-6 space-y-3">
                <a href="tel:+40743864000" className="btn-gold w-full"><Phone size={14} /> Gabriel — +40 743 864 000</a>
                <a href={`https://wa.me/40743864000?text=${encodeURIComponent(t('detail.whatsapp.message') + title)}`} target="_blank" rel="noopener" className="btn-outline w-full">WhatsApp Gabriel</a>
                <a href="tel:+40787860899" className="btn-outline w-full">Alex — +40 787 860 899</a>
                <a href={`https://wa.me/40787860899?text=${encodeURIComponent(t('detail.whatsapp.message') + title)}`} target="_blank" rel="noopener" className="btn-outline w-full">WhatsApp Alex</a>
                <button onClick={share} className="w-full text-[13px] uppercase tracking-[0.18em] text-muted hover:text-ink inline-flex items-center justify-center gap-2 py-3">
                  <Share2 size={14} /> {t('detail.share')}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-line text-sm text-muted space-y-2">
                <div><a href="tel:+40743864000" className="hover:text-gold">Gabriel — +40 743 864 000</a></div>
                <div><a href="https://wa.me/40743864000" target="_blank" rel="noopener" className="hover:text-gold">WhatsApp Gabriel</a></div>
                <div><a href="tel:+40787860899" className="hover:text-gold">Alex — +40 787 860 899</a></div>
                <div><a href="https://wa.me/40787860899" target="_blank" rel="noopener" className="hover:text-gold">WhatsApp Alex</a></div>
                <div>{t('detail.address')}</div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="py-24 border-t border-line">
          <div className="container-lux">
            <div className="eyebrow mb-4">{t('detail.similar')}</div>
            <h2 className="font-display text-3xl md:text-5xl text-ink mb-12">{t('featured.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
              {similar.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col" onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="text-white/60 text-[11px] uppercase tracking-[0.2em]">
              {lightbox + 1} / {property.gallery.length + 1}
            </div>
            <button onClick={() => setLightbox(null)} className="text-white/70 hover:text-white"><X size={28} /></button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 relative min-h-0">
            <button
              onClick={() => setLightbox((lightbox - 1 + property.gallery.length + 1) % (property.gallery.length + 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="relative w-full max-w-5xl aspect-[16/10]">
              <Image
                src={lightbox === 0 ? property.cover_image : property.gallery[lightbox - 1]}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <button
              onClick={() => setLightbox((lightbox + 1) % (property.gallery.length + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="px-4 md:px-8 py-4">
            <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar justify-center">
              <button
                onClick={() => setLightbox(0)}
                className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${lightbox === 0 ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image src={property.cover_image} alt="" fill className="object-cover" sizes="80px" />
              </button>
              {property.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i + 1)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${lightbox === i + 1 ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
