'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { useLang, formatPrice } from '@/lib/i18n';
import { isValidTranslation } from '@/lib/translation-utils';
import { MapPin, Maximize2, BedDouble } from 'lucide-react';

const statusStyles: Record<string, string> = {
  nou: 'bg-gold text-white',
  rezervat: 'bg-ink text-white',
  vandut: 'bg-muted text-white',
  inchiriat: 'bg-muted text-white',
  disponibil: 'bg-white text-ink border border-ink',
};

const listingTypeStyles: Record<string, string> = {
  vanzare: 'bg-gold text-white',
  inchiriat: 'bg-ink text-white',
};

export function PropertyCard({ property, priority = false }: { property: Property; priority?: boolean }) {
  const { t, lang } = useLang();
  const title = lang === 'en' && isValidTranslation(property.title_en) ? property.title_en : property.title;

  return (
    <Link href={`/properties/${property.slug}`} className="group block h-full">
      <article className="surface-card h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image
            src={property.cover_image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            priority={priority}
          />
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 ${listingTypeStyles[property.listing_type] || listingTypeStyles.vanzare}`}>
              {t(`listing_type.${property.listing_type}`)}
            </span>
            <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 ${statusStyles[property.status] || statusStyles.disponibil}`}>
              {t(`status.${property.status}`)}
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted">
            <MapPin size={12} /> {property.location}
          </div>
          <h3 className="font-display text-2xl mt-3 text-ink group-hover:text-gold transition-colors duration-300 leading-tight">
            {title}
          </h3>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-lg font-display text-ink">
              {formatPrice(property.price, property.currency, lang)}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1"><Maximize2 size={12} /> {property.area} m²</span>
              <span className="flex items-center gap-1"><BedDouble size={12} /> {property.rooms} {property.rooms === 1 ? t('card.room') : t('card.rooms')}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
