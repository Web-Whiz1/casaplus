import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { Toaster } from 'sonner';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: {
    default: 'CasaPlus — Plus de Confort, Plus de Calitate',
    template: '%s — CasaPlus',
  },
  description: 'Agenție imobiliară premium dedicată exclusiv Iașului și împrejurimilor. Proprietăți atent selecționate.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://casaplus.ro'),
  openGraph: {
    title: 'CasaPlus — Real Estate Iași',
    description: 'Proprietăți premium în Iași și împrejurimi.',
    type: 'website',
    locale: 'ro_RO',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-canvas text-ink">
        <Providers>
          <div className="site-frame">
            <Header />
            <main className="min-h-[60vh] site-main">{children}</main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
