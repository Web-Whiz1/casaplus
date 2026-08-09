import { NextResponse } from 'next/server';
import { translateRoToEn } from '@/lib/translate';

export async function GET(request) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text') || '';

  if (!text) {
    return NextResponse.json({ error: 'text parameter required' }, { status: 400 });
  }

  try {
    const result = await translateRoToEn(text);
    return NextResponse.json({ original: text, translated: result });
  } catch (error) {
    return NextResponse.json({ error: 'Translation failed', details: String(error) }, { status: 500 });
  }
}
