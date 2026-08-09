'use client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';

type LegalContent = {
  title: string;
  body: string[];
};

const content: Record<string, { ro: LegalContent; en: LegalContent }> = {
  privacy: {
    ro: {
      title: 'Politica de Confidențialitate',
      body: [
        'BBC EDIL INTERMED SRL, care activează sub denumirea comercială CasaPlus, în calitate de operator de date cu caracter personal, respectă confidențialitatea vizitatorilor și clienților site-ului www.casaplus.ro și se angajează să protejeze datele cu caracter personal conform legislației în vigoare, în special Regulamentului (UE) 2016/679 (GDPR) și Legii nr. 190/2018.',
        'Prezenta politică de confidențialitate explică cum sunt colectate, utilizate, stocate și protejate datele dumneavoastră personale atunci când vizitați site-ul sau ne contactați.',
        '',
        '1. OPERATORUL DE DATE',
        'Denumire: BBC EDIL INTERMED SRL',
        'CUI: 36790717',
        'Registrul Comerțului: J22/2526/2016',
        'Sediu: Str. Eternitate 30 Cod 700304',
        'Telefon: +40 743 864 000',
        '',
        '2. DATELE COLECTATE',
        'Colectăm următoarele categorii de date cu caracter personal:',
        '• Date de identificare: nume, prenume',
        '• Date de contact: adresă de e-mail, număr de telefon',
        '• Date furnizate voluntar: mesaje, solicitări de vizionare, preferințe',
        '• Date tehnice: adresă IP, tip browser, pagini vizitate, timp petrecut pe site',
        '',
        '3. SCOPUL PRELUCRĂRII',
        'Datele dumneavoastră sunt prelucrate exclusiv pentru următoarele scopuri:',
        '• Răspunsul la solicitările dumneavoastră privind proprietățile imobiliare',
        '• Programarea vizionărilor',
        '• Furnizarea de informații despre serviciile noastre',
        '• Îmbunătățirea experienței de navigare pe site',
        '• Respectarea obligațiilor legale',
        '',
        '4. TEMEIUL LEGAL',
        'Prelucrarea datelor se bazează pe:',
        '• Consimțământul dumneavoastră (când completați formularul de contact)',
        '• Executarea unor contracte sau măsuri precontractuale',
        '• Respectarea obligațiilor legale',
        '• Interesele noastre legitime de a promova serviciile (marketing direct)',
        '',
        '5. DREPTURILE DUMNEAVOATRĂ',
        'Conform GDPR, aveți următoarele drepturi:',
        '• Dreptul de acces la datele personale',
        '• Dreptul de rectificare a datelor incorecte',
        '• Dreptul la ștergerea datelor ("dreptul de a fi uitat")',
        '• Dreptul la restricționarea prelucrării',
        '• Dreptul la portabilitatea datelor',
        '• Dreptul de opoziție',
        '• Dreptul de a retrage consimțământul oricând',
        '• Dreptul de a depune o plângere la ANSPDCP',
        '',
        '6. PĂSTRAREA DATELOR',
        'Datele personale sunt păstrate pentru perioada necesară realizării scopurilor pentru care au fost colectate, cu respectarea termenelor prevăzute de lege.',
        '',
        '7. SECURITATE',
        'Aplicăm măsuri tehnice și organizatorice adecvate pentru a proteja datele personale împotriva accesului neautorizat, pierderii, distrugerii sau divulgării.',
        '',
        '8. CONTACT',
        'Pentru orice solicitare privind datele personale, ne puteți contacta la sediul social sau telefonic.',
      ],
    },
    en: {
      title: 'Privacy Policy',
      body: [
        'BBC EDIL INTERMED SRL, operating under the trade name CasaPlus, as a personal data operator, respects the privacy of visitors and clients of the www.casaplus.ro website and commits to protecting personal data in accordance with applicable legislation, particularly Regulation (EU) 2016/679 (GDPR) and Law no. 190/2018.',
        'This privacy policy explains how your personal data is collected, used, stored and protected when you visit the site or contact us.',
        '',
        '1. DATA OPERATOR',
        'Name: BBC EDIL INTERMED SRL',
        'VAT: 36790717',
        'Trade Registry: J22/2526/2016',
        'Headquarters: Str. Eternitate 30 Cod 700304',
        'Phone: +40 743 864 000',
        '',
        '2. DATA COLLECTED',
        'We collect the following categories of personal data:',
        '• Identification data: first name, last name',
        '• Contact data: email address, phone number',
        '• Voluntarily provided data: messages, viewing requests, preferences',
        '• Technical data: IP address, browser type, pages visited, time spent on site',
        '',
        '3. PURPOSE OF PROCESSING',
        'Your data is processed exclusively for the following purposes:',
        '• Responding to your requests regarding real estate properties',
        '• Scheduling viewings',
        '• Providing information about our services',
        '• Improving the browsing experience on the site',
        '• Compliance with legal obligations',
        '',
        '4. LEGAL BASIS',
        'Data processing is based on:',
        '• Your consent (when filling out the contact form)',
        '• Performance of a contract or pre-contractual measures',
        '• Compliance with legal obligations',
        '• Our legitimate interests in promoting services (direct marketing)',
        '',
        '5. YOUR RIGHTS',
        'Under GDPR, you have the following rights:',
        '• Right of access to personal data',
        '• Right to rectification of incorrect data',
        '• Right to erasure ("right to be forgotten")',
        '• Right to restriction of processing',
        '• Right to data portability',
        '• Right to object',
        '• Right to withdraw consent at any time',
        '• Right to file a complaint with ANSPDCP',
        '',
        '6. DATA RETENTION',
        'Personal data is retained for the period necessary to fulfill the purposes for which it was collected, respecting the deadlines provided by law.',
        '',
        '7. SECURITY',
        'We apply appropriate technical and organizational measures to protect personal data against unauthorized access, loss, destruction or disclosure.',
        '',
        '8. CONTACT',
        'For any requests regarding personal data, you can contact us at our headquarters or by phone.',
      ],
    },
  },
  terms: {
    ro: {
      title: 'Termeni și Condiții',
      body: [
        'Prin accesarea site-ului www.casaplus.ro, acceptați următorii termeni și condiții.',
        '',
        '1. CONSIDERENTE',
        'BBC EDIL INTERMED SRL, denumită în continuare CasaPlus, este o agenție imobiliară autorizată, înregistrată la Registrul Comerțului cu numărul J22/2526/2016 și CUI 36790717, cu sediul în Str. Eternitate 30 Cod 700304.',
        '',
        '2. SERVICII',
        'CasaPlus oferă servicii de mediere imobiliară, consultanță și promovare a proprietăților imobiliare în Iași și împrejurimi.',
        '',
        '3. DREPTURILE DE AUTOR',
        'Conținutul site-ului (texte, imagini, logo-uri, videoclipuri, structură) este proprietatea exclusivă a CasaPlus sau a partenerilor săi și este protejat de Legea nr. 8/1996 privind dreptul de autor și drepturile conexe.',
        '',
        '4. INFORMAȚII DESPRE PROPRIETĂȚI',
        'Informațiile prezentate pe site referitoare la proprietăți (preț, suprafață, dotări) sunt orientative și pot fi modificate fără notificare prealabilă.',
        'Detaliile finale se confirmă exclusiv prin contractul de mandat sau de vânzare-cumpărare.',
        '',
        '5. RĂSPUNDEREA',
        'CasaPlus nu garantează disponibilitatea continuă a site-ului și nu răspunde pentru întreruperi temporare cauzate de forță majoră.',
        'Nu suntem răspunzători pentru informațiile inexacte furnizate de terți.',
        '',
        '6. CONFIDENȚIALITATE',
        'Datele personale colectate sunt tratate conform Politicii de Confidențialitate și legislației în vigoare (GDPR, Legea 190/2018).',
        '',
        '7. LEGISLAȚIA APLICABILĂ',
        'Prezentii termeni și condiții sunt guvernați de legea română.',
        'Orice litigiu se va soluționa pe cale amiabilă. În caz contrar, instanțele competente din Iași vor avea jurisdicția exclusivă.',
      ],
    },
    en: {
      title: 'Terms and Conditions',
      body: [
        'By accessing the website www.casaplus.ro, you accept the following terms and conditions.',
        '',
        '1. PREAMBLE',
        'BBC EDIL INTERMED SRL, hereinafter referred to as CasaPlus, is an authorized real estate agency, registered with the Trade Registry under no. J22/2526/2016 and VAT 36790717, with headquarters at Str. Eternitate 30 Cod 700304.',
        '',
        '2. SERVICES',
        'CasaPlus provides real estate mediation, consultancy and promotion services in Iași and surrounding areas.',
        '',
        '3. COPYRIGHT',
        'The content of the site (texts, images, logos, videos, structure) is the exclusive property of CasaPlus or its partners and is protected by Law no. 8/1996 on copyright and related rights.',
        '',
        '4. PROPERTY INFORMATION',
        'The information presented on the site regarding properties (price, area, amenities) is indicative and may be changed without prior notice.',
        'Final details are confirmed exclusively through the mandate or sale-purchase contract.',
        '',
        '5. LIABILITY',
        'CasaPlus does not guarantee continuous availability of the site and is not responsible for temporary interruptions caused by force majeure.',
        'We are not responsible for inaccurate information provided by third parties.',
        '',
        '6. CONFIDENTIALITY',
        'Collected personal data is processed in accordance with the Privacy Policy and applicable legislation (GDPR, Law 190/2018).',
        '',
        '7. APPLICABLE LAW',
        'These terms and conditions are governed by Romanian law.',
        'Any dispute will be resolved amicably. Otherwise, the competent courts in Iași shall have exclusive jurisdiction.',
      ],
    },
  },
  gdpr: {
    ro: {
      title: 'GDPR - Drepturile Dumneavoastră',
      body: [
        'Regulamentul (UE) 2016/679 (GDPR) și Legea nr. 190/2018 vă acordă următoarele drepturi cu privire la datele cu caracter personal:',
        '',
        '1. DREPTUL DE ACCES',
        'Aveți dreptul să obțineți confirmarea că datele dumneavoastră sunt prelucrate, precum și informații detaliate privind aceste prelucrări.',
        '',
        '2. DREPTUL DE RECTIFICARE',
        'Puteți solicita corectarea datelor incorecte sau completarea datelor incomplete.',
        '',
        '3. DREPTUL LA ȘTERGERE ("DREPTUL DE A FI UITAT")',
        'Puteți solicita ștergerea datelor personale când:',
        '• Nu mai sunt necesare pentru scopurile pentru care au fost colectate',
        '• Retrageți consimțământul și nu există alt temei legal',
        '• Vă opuneți prelucrării și nu există motive legitime care să prevaleze',
        '',
        '4. DREPTUL LA RESTRICȚIONAREA PRELUCRĂRII',
        'Puteți solicita restricționarea prelucrării în anumite situații legale.',
        '',
        '5. DREPTUL LA PORTABILATEA DATELOR',
        'Aveți dreptul să primiți datele într-un format structurat, utilizat frecvent și lizibil de către un automat, precum și să le transmiteți altui operator.',
        '',
        '6. DREPTUL DE OPZIȚIE',
        'Puteți să vă opuneți oricând prelucrării datelor personale, inclusiv pentru marketing direct.',
        '',
        '7. DREPTUL DE A DEPUNE O PLÂNGERE',
        'Aveți dreptul să depuneți o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP):',
        '• Website: www.dataprotection.ro',
        '• Email: anspdcp@dataprotection.ro',
        '• Adresă: 28 Bvd. Ion Mihalache, sector 1, București',
        '',
        '8. CONTACT PENTRU SOLICITĂRI',
        'Pentru exercitarea drepturilor dumneavoastră, ne puteți contacta la sediul social sau telefonic.',
        '• Telefon: +40 743 864 000',
        '• Adresă: Str. Eternitate 30 Cod 700304',
        '',
        'Vom răspunde solicitării dumneavoastră în termen de 30 de zile calendaristice.',
      ],
    },
    en: {
      title: 'GDPR - Your Rights',
      body: [
        'Regulation (EU) 2016/679 (GDPR) and Law no. 190/2018 grant you the following rights regarding personal data:',
        '',
        '1. RIGHT OF ACCESS',
        'You have the right to obtain confirmation that your personal data is being processed, as well as detailed information about such processing.',
        '',
        '2. RIGHT TO RECTIFICATION',
        'You may request the correction of incorrect data or the completion of incomplete data.',
        '',
        '3. RIGHT TO ERASURE ("RIGHT TO BE FORGOTTEN")',
        'You may request the deletion of personal data when:',
        '• It is no longer necessary for the purposes for which it was collected',
        '• You withdraw your consent and there is no other legal basis',
        '• You object to processing and there are no legitimate grounds to override',
        '',
        '4. RIGHT TO RESTRICTION OF PROCESSING',
        'You may request restriction of processing in certain legal situations.',
        '',
        '5. RIGHT TO DATA PORTABILITY',
        'You have the right to receive your data in a structured, commonly used and machine-readable format, as well as to transmit it to another operator.',
        '',
        '6. RIGHT TO OBJECT',
        'You may object at any time to the processing of personal data, including for direct marketing.',
        '',
        '7. RIGHT TO LODGE A COMPLAINT',
        'You have the right to lodge a complaint with the National Supervisory Authority for Personal Data Processing (ANSPDCP):',
        '• Website: www.dataprotection.ro',
        '• Email: anspdcp@dataprotection.ro',
        '• Address: 28 Bvd. Ion Mihalache, sector 1, Bucharest',
        '',
        '8. CONTACT FOR REQUESTS',
        'To exercise your rights, you can contact us at our headquarters or by phone.',
        '• Phone: +40 743 864 000',
        '• Address: Str. Eternitate 30 Cod 700304',
        '',
        'We will respond to your request within 30 calendar days.',
      ],
    },
  },
  anpc: {
    ro: {
      title: 'ANPC',
      body: [
        'Autoritatea Națională pentru Protecția Consumatorilor (ANPC) este instituția publică care asigură aplicarea legislației privind protecția consumatorilor.',
        '',
        'Drepturile dumneavoastră ca consumatori:',
        '• Dreptul la informații corecte și clare',
        '• Dreptul la siguranța produselor și serviciilor',
        '• Dreptul la despăgubiri în caz de prejudiciu',
        '• Dreptul de a depune plângeri',
        '',
        'Site ANPC: www.anpc.ro',
        'Telefon ANPC: 021 9551 (call center național)',
        'Email: contact@anpc.ro',
      ],
    },
    en: {
      title: 'ANPC',
      body: [
        'The National Authority for Consumer Protection (ANPC) is the public institution that ensures the application of consumer protection legislation.',
        '',
        'Your rights as consumers:',
        '• Right to correct and clear information',
        '• Right to safety of products and services',
        '• Right to compensation in case of damage',
        '• Right to file complaints',
        '',
        'ANPC website: www.anpc.ro',
        'ANPC phone: 021 9551 (national call center)',
        'Email: contact@anpc.ro',
      ],
    },
  },
  sol: {
    ro: {
      title: 'Soluționarea Online a Litigiilor (SOL)',
      body: [
        'Platforma SOL oferă consumatorilor și comercianților o modalitate simplă de a soluționa litigiile online legate de vânzări sau servicii.',
        '',
        'Accesați platforma la: https://ec.europa.eu/consumers/odr',
        '',
        'Pentru a iniția un procedeu de soluționare a litigiului, va trebui să introduceți:',
        '• datele dumneavoastră',
        '• datele operatorului economic',
        '• o descriere a litigiului',
        '• o propunere de soluționare',
      ],
    },
    en: {
      title: 'Online Dispute Resolution (ODR)',
      body: [
        'The ODR platform offers consumers and traders a simple way to resolve online disputes related to sales or services.',
        '',
        'Access the platform at: https://ec.europa.eu/consumers/odr',
        '',
        'To initiate a dispute resolution procedure, you will need to enter:',
        '• your details',
        '• the economic operator details',
        '• a description of the dispute',
        '• a proposed solution',
      ],
    },
  },
};

export default function LegalPage() {
  const { lang } = useLang();
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/legal\/([^\/]+)/);
    if (match) setSlug(match[1]);
  }, []);

  if (!slug) {
    return (
      <section className="page-hero pb-24">
        <div className="container-lux max-w-3xl">
          <div className="bg-white border border-line p-8 md:p-12 shadow-soft">
            <Link href="/" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-muted hover:text-gold">← Acasă</Link>
            <h1 className="section-title mt-8">Pagina nu a fost găsită</h1>
          </div>
        </div>
      </section>
    );
  }

  const doc = content[slug];
  if (!doc) notFound();

  const langKey = lang === 'en' ? 'en' : 'ro';
  const { title, body } = doc[langKey];

  return (
    <section className="page-hero pb-24">
      <div className="container-lux max-w-3xl">
        <div className="bg-white border border-line p-8 md:p-12 shadow-soft">
          <Link href="/" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-muted hover:text-gold">← Acasă</Link>
          <h1 className="section-title mt-8">{title}</h1>
          <div className="mt-12 space-y-6 text-ink leading-relaxed whitespace-pre-line">
            {body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
