import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { translateRoToEn } from '@/lib/translate';
import { isBadTranslation } from '@/lib/translation-utils';

function validateBody(body = {}) {
  const errors = [];
  if (!body.title || !String(body.title).trim()) errors.push('title is required');
  if (!body.slug || !String(body.slug).trim()) errors.push('slug is required');
  if (!body.location || !String(body.location).trim()) errors.push('location is required');
  if (!body.cover_image || !String(body.cover_image).trim()) errors.push('cover_image is required');
  if (errors.length) throw new Error(errors.join(', '));
}

async function normalizeBody(body = {}) {
  const now = new Date().toISOString();
  validateBody(body);
  const payload = {
    id: body.id || cryptoId(),
    slug: await uniqueSlug(body.slug || slugify(body.title || 'property'), body.id),
    title: body.title || 'CasaPlus property',
    title_en: body.title_en || '',
    description: body.description || '',
    description_en: body.description_en || '',
    price: Number(body.price || 0),
    currency: body.currency || 'EUR',
    type: body.type || 'apartament',
    listing_type: body.listing_type || 'vanzare',
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
    cover_image: body.cover_image || '',
    gallery: Array.isArray(body.gallery) ? body.gallery.filter(url => url !== body.cover_image) : (body.cover_image ? [body.cover_image] : []),
    featured: Boolean(body.featured),
    published: body.published ?? true,
    created_at: body.created_at || now,
  };

  return payload;
}

async function enrichWithTranslations(payload) {
  try {
    const [titleEn, descEn] = await Promise.all([
      payload.title_en && isValidTranslation(payload.title_en)
        ? Promise.resolve(payload.title_en)
        : translateRoToEn(payload.title).then(r => {
            console.log('Translated title:', payload.title, '->', r);
            return r;
          }),
      payload.description_en && isValidTranslation(payload.description_en)
        ? Promise.resolve(payload.description_en)
        : translateRoToEn(payload.description).then(r => {
            console.log('Translated description:', payload.description, '->', r);
            return r;
          }),
    ]);

    return {
      ...payload,
      title_en: isValidTranslation(titleEn) && titleEn.toLowerCase() !== payload.title.toLowerCase() ? titleEn : '',
      description_en: isValidTranslation(descEn) && descEn.toLowerCase() !== payload.description.toLowerCase() ? descEn : '',
    };
  } catch (error) {
    console.error('Translation enrichment failed:', error);
    return {
      ...payload,
      title_en: '',
      description_en: '',
    };
  }
}

function isValidTranslation(text) {
  if (!text || !text.trim()) return false;
  const lower = text.toLowerCase().trim();
  if (lower.length < 3) return false;
  if (/^(enter|type|select|choose|search|click|please|keyword)\b/i.test(lower)) return false;
  if (lower.includes('enter keyword')) return false;
  return true;
}

async function checkDbSchema() {
  try {
    const { error } = await supabaseAdmin
      .from('properties')
      .select('listing_type, title_en, description_en')
      .limit(1);

    if (error) {
      console.error('Database schema check failed:', error.message);
      console.error('Run these SQL commands in Supabase Dashboard -> SQL Editor:');
      console.error("ALTER TABLE properties ADD COLUMN IF NOT EXISTS listing_type text DEFAULT 'vanzare';");
      console.error("ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_en text;");
      console.error("ALTER TABLE properties ADD COLUMN IF NOT EXISTS description_en text;");
    }
  } catch (e) {
    console.error('Schema check error:', e);
  }
}

checkDbSchema();

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

async function uniqueSlug(baseSlug, excludeId) {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    let query = supabaseAdmin.from('properties').select('slug').eq('slug', slug);
    if (excludeId) {
      query = query.not('id', 'neq', excludeId);
    }
    const { data } = await query.limit(1);

    if (!data || data.length === 0) {
      break;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return slug;
}

async function fetchAll() {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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
      if (url.searchParams.get('latest') === '1') data = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const limit = Number(url.searchParams.get('limit') || '0');
      if (limit > 0) data = data.slice(0, limit);
      return NextResponse.json({ data });
    }

    const slug = path[1];
    let one = all.find(p => p.slug === slug);
    if (!one) {
      try {
        const { data, error } = await supabaseAdmin
          .from('properties')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();
        if (!error && data) one = data;
      } catch {}
    }
    if (!one) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ data: one });
  }

  return NextResponse.json({ error: 'unknown route' }, { status: 404 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = await normalizeBody(body);
    const enriched = await enrichWithTranslations(payload);

    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert([enriched])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json({ data, ok: true }, { status: 201 });
  } catch (error) {
    console.error('Create failed:', error);
    return NextResponse.json({ error: 'Create failed', details: error.message || String(error), stack: error.stack }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body?.id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const payload = await normalizeBody(body);
    const enriched = await enrichWithTranslations(payload);

    const { data, error } = await supabaseAdmin
      .from('properties')
      .update(enriched)
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

    let listing = null;
    try {
      const { data } = await supabaseAdmin.from('properties').select('cover_image, gallery').eq('id', id).single();
      listing = data;
    } catch {}

    const { error } = await supabaseAdmin
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (listing) {
      const imagekitPublicKey = process.env.IMAGEKIT_PUBLIC_KEY;
      const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
      const imagekitUrl = process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL;

      if (imagekitPublicKey && imagekitPrivateKey && imagekitUrl) {
        const hostname = new URL(imagekitUrl).hostname;
        const paths = [];

        const addPath = (url) => {
          if (!url) return;
          try {
            const u = new URL(url);
            if (u.hostname === hostname) {
              paths.push(u.pathname);
            }
          } catch {}
        };

        addPath(listing.cover_image);
        (listing.gallery || []).forEach(addPath);

        if (paths.length > 0) {
          try {
            const auth = btoa(`${imagekitPublicKey}:${imagekitPrivateKey}`);
            await fetch('https://api.imagekit.io/v1/files/bulk/delete', {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ filePaths: paths }),
            });
          } catch (e) {
            console.error('ImageKit delete failed:', e);
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed', details: String(error) }, { status: 500 });
  }
}
