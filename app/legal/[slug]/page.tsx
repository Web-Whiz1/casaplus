import { notFound } from 'next/navigation';
import Link from 'next/link';

const content: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: 'Politică de Confidențialitate',
    body: [
      'BBC EDIL INTERMED SRL („CasaPlus”) respectă confidențialitatea datelor dumneavoastră personale și se angajează să le protejeze conform Regulamentului (UE) 2016/679 (GDPR) și Legii nr. 190/2018.',
      'Datele colectate (nume, telefon, e-mail, mesaj) sunt folosite exclusiv pentru a răspunde solicitărilor dvs. privind proprietățile imobiliare listate.',
      'Datele nu sunt vândute sau transferate către terți. Sunt păstrate pentru perioada necesară realizării scopului, după care sunt șterse.',
      'Aveți dreptul de acces, rectificare, ștergere, portabilitate, opoziție și restricționare. Pentru orice solicitare: contact@casaplus.ro.',
      'Autoritatea de supraveghere: Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (www.dataprotection.ro).',
    ],
  },
  cookies: {
    title: 'Politică Cookies',
    body: [
      'Site-ul CasaPlus utilizează cookies strict necesare pentru funcționare și cookies analitice pentru îmbunătățirea experienței.',
      'Puteti dezactiva cookies din setările browserului dvs. Dezactivarea poate afecta anumite funcționalități.',
      'Cookies utilizate: session, preferences (limbă), analytics (anonim).',
    ],
  },
  terms: {
    title: 'Termeni și Condiții',
    body: [
      'Prin accesarea site-ului www.casaplus.ro acceptați următorii termeni și condiții.',
      'Conținutul site-ului (texte, imagini, mărci) este proprietatea BBC EDIL INTERMED SRL sau a partenerilor săi și este protejat de legea drepturilor de autor.',
      'Informațiile despre proprietăți sunt orientative. Detaliile finale se confirmă prin contract cu proprietarul.',
      'CasaPlus își rezervă dreptul de a modifica conținutul și termenii fără notificare prealabilă.',
    ],
  },
  gdpr: {
    title: 'GDPR',
    body: [
      'Conform Regulamentului (UE) 2016/679, BBC EDIL INTERMED SRL este operator de date cu caracter personal.',
      'Sedu: Strada Eternitate nr. 30, Iași. CUI: 36790717.',
      'Aveți dreptul de a solicita informații, rectificarea sau ștergerea datelor, restricționarea prelucrării, portabilitatea datelor și opoziția.',
      'Solicitările GDPR pot fi transmise la: gdpr@casaplus.ro sau prin poștă la sediul social.',
    ],
  },
  anpc: {
    title: 'ANPC',
    body: [
      'Autoritatea Națională pentru Protecția Consumatorilor — www.anpc.ro',
      'Consumatorii au dreptul de a sesiza ANPC pentru orice nemulțumire legată de serviciile CasaPlus.',
      'Adresă ANPC: Bd. Aviatorilor nr. 72, Sector 1, București.',
    ],
  },
  sol: {
    title: 'Soluționarea Online a Litigiilor (SOL)',
    body: [
      'Comisia Europeană pune la dispoziția consumatorilor platforma SOL pentru soluționarea online a litigiilor.',
      'Accesați: https://ec.europa.eu/consumers/odr',
    ],
  },
};

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = content[slug];
  if (!doc) notFound();

  return (
    <section className="page-hero pb-24">
      <div className="container-lux max-w-3xl">
        <div className="bg-white border border-line p-8 md:p-12 shadow-soft">
          <Link href="/" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-muted hover:text-gold">← Acasă</Link>
          <h1 className="section-title mt-8">{doc.title}</h1>
          <div className="mt-12 space-y-6 text-ink leading-relaxed">
            {doc.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  return Object.keys(content).map(slug => ({ slug }));
}
