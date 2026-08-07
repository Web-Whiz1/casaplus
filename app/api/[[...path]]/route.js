import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEMO_PROPERTIES } from '@/lib/demo-properties';

const safeDemo = DEMO_PROPERTIES;

function normalizeBody(body = {}) {
  const now = new Date().toISOString();
  const payload = {
    id: body.id || cryptoId(),
    slug: body.slug || slugify(body.title || 'property'),
    title: body.title || 'CasaPlus property',
    title_en: body.title_en || '',
    description: body.description || '',
    description_en: body.description_en || '',
    price: Number(body.price || 0),
    currency: body.currency || 'EUR',
    type: body.type || 'apartament',
    status: body.status || 'disponibil',
    location: body.location || 'Iași, Romania',
    area: Number(body.area || 0),
    rooms: Number(body.rooms || 1),
    bathrooms: Number(body.bathrooms || 1),
    floor: body.floor || '',
    year_built: Number(body.year_built || new Date().getFullYear()),
    heating: body.heating || '',
    parking: Boolean(body.parking),
    balcony: Boolean(body.balcony),
    storage: Boolean(body.storage),
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    cover_image: body.cover_image || safeDemo[0]?.cover_image || '',
    gallery: Array.isArray(body.gallery) ? body.gallery : (body.cover_image ? [body.cover_image] : []),
    featured: Boolean(body.featured),
    published: body.published ?? true,
    created_at: body.created_at || now,
  };

  return payload;
}

function cryptoId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 9; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `property-${out}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'property';
}

async function fetchAll() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length) return data;
  } catch {}
  return safeDemo;
}

export async function GET(request, { params }) {
  const resolved = await params;
  const path = resolved.path || [];
  const url = new URL(request.url);

  if (path.length === 0) {
    return NextResponse.json({ ok: true, service: 'CasaPlus API', ts: new Date().toISOString() });
  }

  if (path[0] === 'properties') {
    const all = await fetchAll();

    if (path.length === 1) {
      let data = all;
      if (url.searchParams.get('featured') === '1') data = data.filter(p => p.featured);
      const type = url.searchParams.get('type');
      if (type) data = data.filter(p => p.type === type);
      return NextResponse.json({ data });
    }

    const slug = path[1];
    const one = all.find(p => p.slug === slug);
    if (!one) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ data: one });
  }

  return NextResponse.json({ error: 'unknown route' }, { status: 404 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = normalizeBody(body);

    const { data, error } = await supabase
      .from('properties')
      .insert([payload])
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data, ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Create failed', details: String(error) }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body?.id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const payload = normalizeBody(body);

    const { data, error } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', payload.id)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ data, ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = body?.id;
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed', details: String(error) }, { status: 500 });
  }
}
