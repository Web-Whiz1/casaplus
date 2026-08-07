import { supabase } from './supabase';
import { Property } from './types';
import { DEMO_PROPERTIES } from './demo-properties';

// Try to fetch from Supabase; fall back to demo data if table missing/empty.
export async function getAllProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return DEMO_PROPERTIES;
    return data as Property[];
  } catch {
    return DEMO_PROPERTIES;
  }
}

export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  const all = await getAllProperties();
  return all.filter(p => p.featured).slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const all = await getAllProperties();
  return all.find(p => p.slug === slug) || null;
}

export async function getSimilarProperties(current: Property, limit = 3): Promise<Property[]> {
  const all = await getAllProperties();
  return all
    .filter(p => p.id !== current.id && (p.type === current.type || p.location.split(',')[0] === current.location.split(',')[0]))
    .slice(0, limit);
}
