import DOMPurify from 'dompurify';

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

export function formatDrivePreviewLink(url: string | undefined | null): string {
  if (!url || url.trim() === "") return "";
  const trimmed = url.trim();
  
  const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  
  return trimmed;
}

export function cleanHtml(html: string | undefined | null): string {
  if (!html) return "";
  
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'br', 'hr', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'title'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
    });
  }
  
  // Fallback for non-browser environments: strip all HTML tags
  return html.replace(/<[^>]*>?/gm, '');
}
