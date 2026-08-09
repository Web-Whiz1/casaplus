const cache = new Map<string, string>();

function isBadTranslation(text: string): boolean {
  if (!text || !text.trim()) return true;
  const lower = text.toLowerCase().trim();
  if (lower.length < 3) return true;
  if (/^(enter|type|select|choose|search|click|please|keyword)\b/i.test(lower)) return true;
  if (lower.includes('enter keyword')) return true;
  return false;
}

async function translateWithGoogleTranslate(text: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ro&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translated = data[0][0][0];
      if (!isBadTranslation(translated)) {
        return translated;
      }
    }
  } catch (e) {
    console.error('Google Translate failed:', e);
  }

  return null;
}

async function translateWithLibre(text: string): Promise<string | null> {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'ro',
        target: 'en',
        format: 'text',
      }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    if (data?.translatedText && !isBadTranslation(data.translatedText)) {
      return data.translatedText;
    }
  } catch (e) {
    console.error('LibreTranslate failed:', e);
  }

  return null;
}

async function translateWithMyMemory(text: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.mymemory.translated.net/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        q: text,
        langpair: 'ro|en',
      }),
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json();
    if (data?.responseData?.translatedText && !isBadTranslation(data.responseData.translatedText)) {
      return data.responseData.translatedText;
    }
  } catch (e) {
    console.error('MyMemory failed:', e);
  }

  return null;
}

export async function translateRoToEn(text: string): Promise<string> {
  if (!text || !text.trim()) return '';

  const trimmed = text.trim();
  if (cache.has(trimmed)) {
    return cache.get(trimmed)!;
  }

  let result = trimmed;

  try {
    result = await translateWithGoogleTranslate(trimmed) || trimmed;
  } catch {}

  if (result === trimmed) {
    try {
      result = await translateWithLibre(trimmed) || trimmed;
    } catch {}
  }

  if (result === trimmed) {
    try {
      result = await translateWithMyMemory(trimmed) || trimmed;
    } catch {}
  }

  if (result !== trimmed && !isBadTranslation(result)) {
    cache.set(trimmed, result);
  }

  return result;
}

export async function translateBatchRoToEn(items: Array<{ ro: string; en?: string }>): Promise<Array<{ ro: string; en: string }>> {
  return Promise.all(
    items.map(async (item) => ({
      ro: item.ro,
      en: item.en || (await translateRoToEn(item.ro)),
    }))
  );
}
