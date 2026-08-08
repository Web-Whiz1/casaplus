'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Save, Trash2, Upload } from 'lucide-react';
import { upload } from '@imagekit/next';
import { Property } from '@/lib/types';

const emptyDraft: Partial<Property> & { cover_image: string; gallery: string[] } = {
  id: '',
  slug: '',
  title: '',
  description: '',
  price: 0,
  currency: 'EUR',
  type: 'apartament',
  listing_type: 'vanzare',
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const fetchProperties = async () => {
    const res = await fetch('/api/properties');
    if (!res.ok) {
      setStatus('API error: ' + res.statusText);
      setProperties([]);
      return;
    }
    const json = await res.json();
    setProperties((json.data || []) as Property[]);
  };

  useEffect(() => {
    const session = localStorage.getItem('casaplus-admin-session');
    if (session === 'active') {
      setLoggedIn(true);
      fetchProperties();
    }
  }, []);

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginForm.username === 'admincasaplus' && loginForm.password === '12345678') {
      localStorage.setItem('casaplus-admin-session', 'active');
      setLoggedIn(true);
      setLoginError('');
      fetchProperties();
      return;
    }

    setLoginError('Credentiale incorecte.');
  };

  const logout = () => {
    localStorage.removeItem('casaplus-admin-session');
    setLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

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

    const res = await fetch('/api/properties', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setStatus('Nu s-a putut șterge anunțul: ' + (json?.error || res.statusText));
      return;
    }

    setStatus('Anunțul a fost șters.');
    setDraft({ ...emptyDraft });
    fetchProperties();
  };

  const createOrUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    if (!draft.cover_image) {
      setSaving(false);
      setStatus('Adaugă cel puțin o imagine de copertă.');
      return;
    }

    const payload = {
      ...draft,
      id: draft.id || undefined,
      slug: draft.slug || (draft.title ? draft.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'property') || 'property',
      price: Number(draft.price || 0),
      area: Number(draft.area || 0),
      rooms: Number(draft.rooms || 0),
      bathrooms: Number(draft.bathrooms || 0),
      year_built: Number(draft.year_built || new Date().getFullYear()),
      created_at: draft.created_at || new Date().toISOString(),
    };

    const isUpdate = Boolean(draft.id);
    const res = await fetch('/api/properties', {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      const action = isUpdate ? 'Update' : 'Create';
      setStatus(action + ' error: ' + (json?.error || json?.details || res.statusText));
      return;
    }

    const json = await res.json().catch(() => ({}));
    setStatus(isUpdate ? 'Anunțul a fost actualizat.' : 'Anunțul a fost creat.');
    setDraft({ ...emptyDraft });
    fetchProperties();
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const authRes = await fetch('/api/upload-auth');
      if (!authRes.ok) throw new Error('Failed to get upload auth');
      const auth = await authRes.json();

      const uploadResponse = await upload({
        file,
        fileName: file.name,
        token: auth.token,
        expire: Number(auth.expire),
        signature: auth.signature,
        publicKey: auth.publicKey,
        useUniqueFileName: true,
      });

      const nextUrl = uploadResponse.url;
      setDraft((current: any) => ({
        ...current,
        cover_image: nextUrl,
        gallery: Array.from(new Set([...(current.gallery || []), nextUrl])),
      }));

      setStatus('Imagine încărcată către ImageKit.');
    } catch (err) {
      setStatus('Imaginea nu a putut fi încărcată.');
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const authRes = await fetch('/api/upload-auth');
      if (!authRes.ok) throw new Error('Failed to get upload auth');
      const auth = await authRes.json();

      const uploadResponse = await upload({
        file,
        fileName: file.name,
        token: auth.token,
        expire: Number(auth.expire),
        signature: auth.signature,
        publicKey: auth.publicKey,
        useUniqueFileName: true,
      });

      const nextUrl = uploadResponse.url;
      setDraft((current: any) => {
        const gallery = Array.from(new Set([...(current.gallery || []), nextUrl]));
        return { ...current, gallery };
      });

      setStatus('Imagine galerie încărcată.');
    } catch (err) {
      setStatus('Imaginea nu a putut fi încărcată.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    setDraft((current: any) => {
      const gallery = (current.gallery || []).filter((u: string) => u !== url);
      const cover_image = current.cover_image === url ? '' : current.cover_image;
      return { ...current, gallery, cover_image };
    });
  };

  const setCoverImage = (url: string) => {
    setDraft((current: any) => ({ ...current, cover_image: url }));
  };

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-24">
      {!loggedIn ? (
        <section className="container-lux min-h-[65vh] flex items-center justify-center">
          <div className="surface-card max-w-md w-full p-8 md:p-12">
            <div className="text-center">
              <div className="eyebrow mb-4">CasaPlus Admin</div>
              <h1 className="font-display text-4xl text-ink leading-none">Login</h1>
            </div>
            <form className="mt-10 space-y-5" onSubmit={login}>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Username</span>
                <input value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" required />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Parolă</span>
                <input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" required />
              </label>
              {loginError && <div className="text-[11px] uppercase tracking-[0.2em] text-gold">{loginError}</div>}
              <button className="btn-gold w-full justify-center" type="submit">Intră în admin</button>
            </form>
          </div>
        </section>
      ) : (
        <>
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
                  <button className="btn-outline px-4 py-2" onClick={logout}>Logout</button>
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
                <button className="btn-outline px-4 py-2" onClick={logout}>Logout</button>
              </div>

               <form className="mt-8 space-y-6" onSubmit={createOrUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block md:col-span-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Titlu</span>
                    <input value={draft.title || ''} onChange={e => {
                      const title = e.target.value;
                      setDraft(current => ({
                        ...current,
                        title,
                        slug: current.slug || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'property',
                      }));
                    }} className="mt-2 w-full border border-line px-4 py-3" required />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Tranzacție</span>
                    <select value={draft.listing_type || 'vanzare'} onChange={e => setDraft({ ...draft, listing_type: e.target.value })} className="mt-2 w-full border border-line px-4 py-3">
                      <option value="vanzare">De vânzare</option>
                      <option value="inchiriat">De închiriat</option>
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block md:col-span-2">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Descriere</span>
                    <textarea value={draft.description || ''} onChange={e => setDraft({ ...draft, description: e.target.value })} className="mt-2 w-full border border-line px-4 py-3 min-h-28" required />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted">Încălzire</span>
                    <input value={draft.heating || ''} onChange={e => setDraft({ ...draft, heating: e.target.value })} className="mt-2 w-full border border-line px-4 py-3" />
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] mt-6">
                      <input type="checkbox" checked={Boolean(draft.parking)} onChange={e => setDraft({ ...draft, parking: e.target.checked })} /> Parcare
                    </label>
                    <label className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] mt-6">
                      <input type="checkbox" checked={Boolean(draft.balcony)} onChange={e => setDraft({ ...draft, balcony: e.target.checked })} /> Balcon
                    </label>
                    <label className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] mt-6">
                      <input type="checkbox" checked={Boolean(draft.storage)} onChange={e => setDraft({ ...draft, storage: e.target.checked })} /> Boxă
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted mb-3">Imagine copertă</div>
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-2 btn-outline px-4 py-2 cursor-pointer">
                        <Upload size={14} /> {uploading ? 'Se încarcă...' : 'Încarcă imagine copertă'}
                        <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                      </label>
                      <span className="text-[11px] text-muted truncate max-w-[360px]">{draft.cover_image || 'Nicio imagine selectată'}</span>
                    </div>
                    {draft.cover_image && (
                      <div className="mt-4 relative inline-block">
                        <img src={draft.cover_image} alt="" className="w-full max-h-56 object-cover border border-line" />
                        <div className="absolute top-2 left-2 text-[10px] uppercase tracking-[0.2em] bg-white/90 px-2 py-1">Copertă</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted mb-3">Galerie</div>
                    <label className="inline-flex items-center gap-2 btn-outline px-4 py-2 cursor-pointer">
                      <Upload size={14} /> {uploading ? 'Se încarcă...' : 'Adaugă imagine galerie'}
                      <input type="file" accept="image/*" className="hidden" onChange={uploadGalleryImage} />
                    </label>
                    {(draft.gallery || []).length > 0 && (
                      <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                        {(draft.gallery || []).map((url: string, idx: number) => (
                          <div key={url + idx} className="relative group aspect-square border border-line overflow-hidden bg-canvas">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              <button type="button" onClick={() => setCoverImage(url)} className="text-white text-[10px] uppercase tracking-[0.15em] bg-white/20 hover:bg-white/40 px-2 py-1 transition-colors">Copertă</button>
                              <button type="button" onClick={() => removeGalleryImage(url)} className="text-white text-[10px] uppercase tracking-[0.15em] bg-red-500/60 hover:bg-red-500/80 px-2 py-1 transition-colors">Șterge</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
        </>
      )}
    </div>
  );
}
