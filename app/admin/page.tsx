'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, Save, Trash2, Upload } from 'lucide-react';
import { Property } from '@/lib/types';

const emptyDraft: Partial<Property> & { cover_image: string; gallery: string[] } = {
  id: '',
  slug: '',
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  price: 0,
  currency: 'EUR',
  type: 'apartament',
  status: 'nou',
  location: '',
  area: 0,
  rooms: 1,
  bathrooms: 1,
  floor: '',
  year_built: 2024,
  heating: '',
  parking: false,
  balcony: false,
  storage: false,
  featured: false,
  published: true,
  cover_image: '',
  gallery: [],
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchProperties = async () => {
    const res = await fetch('/api/properties');
    const payload = await res.json();
    setProperties(payload?.data || []);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const listTotal = useMemo(() => properties.length, [properties]);

  const beginCreate = () => {
    setDraft({ ...emptyDraft, id: '', slug: '', cover_image: '', gallery: [] });
    setStatus('');
  };

  const beginEdit = (property: Property) => {
    setDraft({ ...property, gallery: property.gallery || [] });
    setStatus('');
  };

  const deleteProperty = async (id: string) => {
    if (!id || !confirm('Ștergi anunțul selectat?')) return;

    const res = await fetch(`/api/properties`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setStatus('Anunțul a fost șters.');
      setDraft({ ...emptyDraft });
      fetchProperties();
    } else {
      setStatus('Nu s-a putut șterge anunțul.');
    }
  };

  const createOrUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...draft,
      id: draft.id || undefined,
      price: Number(draft.price || 0),
      area: Number(draft.area || 0),
      rooms: Number(draft.rooms || 0),
      bathrooms: Number(draft.bathrooms || 0),
      year_built: Number(draft.year_built || new Date().getFullYear()),
      created_at: draft.created_at || new Date().toISOString(),
    };

    const url = '/api/properties';
    const method = draft.id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      setStatus(json?.error || 'Operația a eșuat.');
      return;
    }

    setStatus(draft.id ? 'Anunțul a fost actualizat.' : 'Anunțul a fost creat.');
    setDraft({ ...emptyDraft });
    fetchProperties();
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Upload failed');

      const nextCover = json?.url;
      setDraft((current: any) => ({
        ...current,
        cover_image: nextCover,
        gallery: Array.from(new Set([...(current.gallery || []), nextCover])),
      }));

      setStatus('Imagine încărcată către ImageKit.');
    } catch (err) {
      setStatus('Imaginea nu a putut fi încărcată.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-24">
      <section className="page-hero">
        <div className="container-lux">
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="eyebrow mb-4">Admin</div>
              <h1 className="page-hero-title">CasaPlus Admin</h1>
              <p className="page-subtitle">Gestionare anunțuri imobiliare, galerie și imagine de copertă.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.24em] text-muted">Total</span>
              <span className="font-display text-3xl text-ink">{listTotal}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-lux grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12">
        <div className="surface-card p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-line pb-5">
            <div>
              <div className="eyebrow">Anunțuri</div>
              <h2 className="font-display text-3xl text-ink mt-2">Lista proprietăților</h2>
            </div>
            <button className="btn-gold" onClick={beginCreate}><Plus size={15} /> Adaugă</button>
          </div>

          <div className="mt-6 space-y-4">
            {properties.map((property) => (
              <article key={property.id} className="border border-line bg-white p-4 flex items-center gap-4">
                <div className="w-16 h-16 overflow-hidden border border-line bg-canvas">
                  <img src={property.cover_image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-xl text-ink truncate">{property.title}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted mt-1">{property.location}</div>
                  <div className="mt-2 flex gap-3 items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{property.status}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{property.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-outline px-4 py-2" onClick={() => beginEdit(property)}><Pencil size={14} /></button>
                  <button className="btn-outline px-4 py-2" onClick={() => deleteProperty(property.id)}><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="surface-card p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-line pb-5">
            <div>
              <div className="eyebrow">Editor</div>
              <h2 className="font-display text-3xl text-ink mt-2">{draft.id ? 'Modifică' : 'Adaugă'} anunț</h2>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={createOrUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Titlu</span>
                <input value={draft.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" required />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Titlu EN</span>
                <input value={draft.title_en || ''} onChange={e => setDraft({ ...draft, title_en: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Slug</span>
                <input value={draft.slug || ''} onChange={e => setDraft({ ...draft, slug: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" required />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Tip</span>
                <select value={draft.type || 'apartament'} onChange={e => setDraft({ ...draft, type: e.target.value })} className="mt-2 w-full border border-line px-4 py-3">
                  <option value="apartament">Apartament</option>
                  <option value="casa">Casa</option>
                  <option value="teren">Teren</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="vila">Vila</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Descriere</span>
                <textarea value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} className="mt-2 w-full border border-line px-4 py-3 min-h-28" required />
              </label>
              <label className="block md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Descriere EN</span>
                <textarea value={draft.description_en || ''} onChange={e => setDraft({ ...draft, description_en: e.target.value })} className="mt-2 w-full border border-line px-4 py-3 min-h-28" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Preț</span>
                <input type="number" value={draft.price || 0} onChange={e => setDraft({ ...draft, price: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Locație</span>
                <input value={draft.location || ''} onChange={e => setDraft({ ...draft, location: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" required />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Suprafață</span>
                <input type="number" value={draft.area || 0} onChange={e => setDraft({ ...draft, area: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Status</span>
                <select value={draft.status || 'nou'} onChange={e => setDraft({ ...draft, status: e.target.value })} className="mt-2 w-full border border-line px-4 py-3">
                  <option value="nou">nou</option>
                  <option value="rezervat">rezervat</option>
                  <option value="vandut">vandut</option>
                  <option value="inchiriat">inchiriat</option>
                  <option value="disponibil">disponibil</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Camere</span>
                <input type="number" value={draft.rooms || 1} onChange={e => setDraft({ ...draft, rooms: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Baie</span>
                <input type="number" value={draft.bathrooms || 1} onChange={e => setDraft({ ...draft, bathrooms: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Etaj</span>
                <input value={draft.floor || ''} onChange={e => setDraft({ ...draft, floor: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">An</span>
                <input type="number" value={draft.year_built || 2024} onChange={e => setDraft({ ...draft, year_built: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
              </label>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted">Imagine copertă</div>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 btn-outline px-4 py-2 cursor-pointer">
                  <Upload size={14} /> {uploading ? 'Se încarcă...' : 'Încarcă imagine'}
                  <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                </label>
                <span className="text-[11px] text-muted truncate max-w-[360px]">{draft.cover_image || 'Nicio imagine selectată'}</span>
              </div>
              {draft.cover_image && (
                <img src={draft.cover_image} alt="" className="w-full max-h-56 object-cover border border-line" />
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                <input type="checkbox" checked={Boolean(draft.featured)} onChange={e => setDraft({ ...draft, featured: e.target.checked })} /> Featured
              </label>
              <label className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                <input type="checkbox" checked={Boolean(draft.published)} onChange={e => setDraft({ ...draft, published: e.target.checked })} /> Publicat
              </label>
            </div>

            {status && <div className="text-[11px] uppercase tracking-[0.2em] text-gold">{status}</div>}

            <div className="flex items-center gap-3 pt-4 border-t border-line">
              <button className="btn-gold" type="submit" disabled={saving}>{saving ? 'Se salvează...' : <><Save size={14} /> Salvează</>}</button>
              <button className="btn-outline" type="button" onClick={beginCreate}>Reset</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
