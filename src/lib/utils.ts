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

export interface VideoEmbedData {
  type: "instagram" | "youtube" | "vimeo" | "direct" | "unknown";
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(url: string | undefined | null): VideoEmbedData | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  // Instagram: /p/CODE or /reel/CODE or /tv/CODE
  const igMatch = trimmed.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  if (igMatch && igMatch[1]) {
    return {
      type: "instagram",
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed/`,
      originalUrl: `https://www.instagram.com/p/${igMatch[1]}/`
    };
  }

  // YouTube
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0`,
      originalUrl: trimmed
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // Direct HTML5 video (.mp4, .webm)
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return {
      type: "direct",
      embedUrl: trimmed,
      originalUrl: trimmed
    };
  }

  // If already an embed URL or other iframe
  return {
    type: "unknown",
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}
