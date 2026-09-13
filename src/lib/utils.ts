export function formatDriveLink(url: string | undefined | null): string {
  if (!url || url.trim() === "") return "";
  const trimmed = url.trim();
  
  // match /file/d/ID
  const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) {
    return `https://drive.google.com/thumbnail?id=${match1[1]}&sz=w1920-h1080`;
  }
  
  // match ?id=ID
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) {
    return `https://drive.google.com/thumbnail?id=${match2[1]}&sz=w1920-h1080`;
  }
  
  return trimmed;
}


export function cleanHtml(html: string | undefined | null): string {
  if (!html) return "";
  let cleaned = html;
  // Видаляємо class, id, style, data-* та інші зайві атрибути
  cleaned = cleaned.replace(/\s+(class|id|style|dir|lang|data-[a-zA-Z0-9_-]+)=["'][^"']*["']/gi, '');
  // Додатково можна видалити порожні span, якщо такі з'являються
  cleaned = cleaned.replace(/<span>(.*?)<\/span>/gi, '$1');
  return cleaned;
}
