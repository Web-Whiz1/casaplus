export function isValidTranslation(text?: string): boolean {
  if (!text || !text.trim()) return false;
  const lower = text.toLowerCase().trim();
  if (lower.length < 3) return false;
  if (/^(enter|type|select|choose|search|click|please|keyword)\b/i.test(lower)) return false;
  if (lower.includes('enter keyword')) return false;
  return true;
}
