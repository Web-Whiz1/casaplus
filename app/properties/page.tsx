'use client';
import { useEffect, useMemo, useState } from 'react';
import { PropertyCard } from '@/components/site/PropertyCard';
import { useLang } from '@/lib/i18n';
import { Property, PropertyType } from '@/lib/types';
import { DEMO_PROPERTIES } from '@/lib/demo-properties';

type Sort = 'new' | 'priceAsc' | 'priceDesc';

export default function PropertiesPage() {
  const { t } = useLang();
  const [properties, setProperties] = useState<Property[]>(DEMO_PROPERTIES);
  const [filter, setFilter] = useState<'all' | PropertyType>('all');
  const [sort, setSort] = useState<Sort>('new');

  useEffect(() => {
    fetch('/api/properties').then(r => r.json()).then(d => {
      if (d?.data?.length) setProperties(d.data);
    }).catch(() => {});
  }, []);

  const filters: Array<{ k: 'all' | PropertyType; label: string }> = [
    { k: 'all', label: t('listing.filter.all') },
    { k: 'apartament', label: t('listing.filter.apartament') },
    { k: 'casa', label: t('listing.filter.casa') },
    { k: 'vila', label: t('listing.filter.vila') },
    { k: 'penthouse', label: t('listing.filter.penthouse') },
  ];

  const filtered = useMemo(() => {
    let list = filter === 'all' ? properties : properties.filter(p => p.type === filter);
    if (sort === 'priceAsc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'priceDesc') list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return list;
  }, [properties, filter, sort]);

  return (
    <>
      <section className="page-hero">
        <div className="container-lux">
          <div className="eyebrow mb-4">CasaPlus — Iași</div>
          <h1 className="page-hero-title">{t('listing.title')}</h1>
          <p className="page-subtitle max-w-2xl">{t('listing.subtitle')}</p>
        </div>
      </section>

      <section className="border-y border-line bg-white sticky top-0 z-30">
        <div className="container-lux py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {filters.map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)}
                className={`text-[12px] uppercase tracking-[0.2em] whitespace-nowrap pb-1 transition-colors border-b ${filter === f.k ? 'text-ink border-gold' : 'text-muted border-transparent hover:text-ink'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted">{t('listing.sort')}:</span>
            <select value={sort} onChange={e => setSort(e.target.value as Sort)}
              className="text-[12px] uppercase tracking-[0.16em] bg-transparent border-b border-line focus:border-gold outline-none py-1 pr-4">
              <option value="new">{t('listing.sort.new')}</option>
              <option value="priceAsc">{t('listing.sort.priceAsc')}</option>
              <option value="priceDesc">{t('listing.sort.priceDesc')}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-lux">
          {filtered.length === 0 ? (
            <div className="py-32 text-center text-muted">{t('listing.empty')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filtered.map((p, i) => <PropertyCard key={p.id} property={p} priority={i < 3} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
