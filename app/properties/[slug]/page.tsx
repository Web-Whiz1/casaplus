'use client';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Maximize2, BedDouble, Bath, Building2, Calendar, Flame, Car, Trees, Package, Phone, Share2, ArrowLeft, X } from 'lucide-react';
import { useLang, formatPrice } from '@/lib/i18n';
import { PropertyCard } from '@/components/site/PropertyCard';
import { Property } from '@/lib/types';
import { DEMO_PROPERTIES } from '@/lib/demo-properties';
import { toast } from 'sonner';

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, lang } = useLang();
  const [property, setProperty] = useState<Property | null>(() => DEMO_PROPERTIES.find(p => p.slug === slug) || null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/properties/${slug}`).then(r => r.json()).then(d => {
      if (d?.data) setProperty(d.data);
    }).catch(() => {});
  }, [slug]);

  if (!property) return notFound();

  const title = lang === 'en' && property.title_en ? property.title_en : property.title;
  const description = lang === 'en' && property.description_en ? property.description_en : property.description;
  const similar = DEMO_PROPERTIES.filter(p => p.id !== property.id && p.type === property.type).slice(0, 3);

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

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[70vh]">
            <button onClick={() => setLightbox(0)} className="md:col-span-2 md:row-span-2 relative overflow-hidden group">
              <Image src={property.cover_image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority sizes="50vw" />
            </button>
            {property.gallery.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setLightbox(i + 1)} className="relative overflow-hidden hidden md:block group">
                <Image src={img} alt={`${title} ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="25vw" />
              </button>
            ))}
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
              <div className="font-display text-2xl mt-2 text-ink">Vorbește cu un consultant</div>
              <p className="text-sm text-muted mt-3">Programează o vizionare sau află mai multe detalii.</p>

              <div className="mt-6 space-y-3">
                <a href="tel:+40787860899" className="btn-gold w-full"><Phone size={14} /> {t('detail.call')}</a>
                <a href={`https://wa.me/40787860899?text=${encodeURIComponent('Bună ziua, sunt interesat de: ' + title)}`} target="_blank" rel="noopener" className="btn-outline w-full">{t('detail.whatsapp')}</a>
                <button onClick={share} className="w-full text-[13px] uppercase tracking-[0.18em] text-muted hover:text-ink inline-flex items-center justify-center gap-2 py-3">
                  <Share2 size={14} /> {t('detail.share')}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-line text-sm text-muted space-y-2">
                <div>+40 787 860 899</div>
                <div>+40 743 864 000</div>
                <div>Piața Unirii nr. 2, Iași</div>
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
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
          <div className="relative w-[92vw] h-[85vh]">
            <Image
              src={lightbox === 0 ? property.cover_image : property.gallery[lightbox - 1]}
              alt={title}
              fill
              className="object-contain"
              sizes="92vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
