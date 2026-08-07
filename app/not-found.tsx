'use client';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useLang();
  return (
    <section className="min-h-[80vh] flex items-center">
      <div className="container-lux text-center">
        <div className="font-display text-[120px] md:text-[200px] text-gold/20 leading-none">404</div>
        <h1 className="font-display text-3xl md:text-5xl text-ink -mt-6">{t('notfound.title')}</h1>
        <p className="text-muted mt-6 max-w-lg mx-auto">{t('notfound.body')}</p>
        <div className="mt-10">
          <Link href="/" className="btn-outline">{t('notfound.back')}</Link>
        </div>
      </div>
    </section>
  );
}
