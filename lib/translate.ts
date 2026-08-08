export async function translateRoToEn(text: string): Promise<string> {
  if (!text || !text.trim()) return '';

  try {
    const res = await fetch('https://api.mymemory.translated.net/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        q: text,
        langpair: 'ro|en',
      }),
    });

    const data = await res.json();
    if (data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
  } catch {}

  return text;
}

export async function translateBatchRoToEn(items: Array<{ ro: string; en?: string }>): Promise<Array<{ ro: string; en: string }>> {
  return Promise.all(
    items.map(async (item) => ({
      ro: item.ro,
      en: item.en || (await translateRoToEn(item.ro)),
    }))
  );
}
