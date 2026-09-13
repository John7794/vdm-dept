const fs = require('fs');

// 1. Update utils.ts
let utils = fs.readFileSync('src/lib/utils.ts', 'utf8');
if (!utils.includes('cleanHtml')) {
  utils += `

export function cleanHtml(html: string | undefined | null): string {
  if (!html) return "";
  let cleaned = html;
  // Видаляємо class, id, style, data-* та інші зайві атрибути
  cleaned = cleaned.replace(/\\s+(class|id|style|dir|lang|data-[a-zA-Z0-9_-]+)=["'][^"']*["']/gi, '');
  // Додатково можна видалити порожні span, якщо такі з'являються
  cleaned = cleaned.replace(/<span>(.*?)<\\/span>/gi, '$1');
  return cleaned;
}
`;
  fs.writeFileSync('src/lib/utils.ts', utils);
}

// 2. Update NewsDetail.tsx
let newsDetail = fs.readFileSync('src/pages/NewsDetail.tsx', 'utf8');
if (!newsDetail.includes('cleanHtml(')) {
  newsDetail = newsDetail.replace(/import \{ formatDriveLink \} from "\.\.\/lib\/utils";/, 'import { formatDriveLink, cleanHtml } from "../lib/utils";');
  newsDetail = newsDetail.replace(/dangerouslySetInnerHTML={{ __html: content }}/, 'dangerouslySetInnerHTML={{ __html: cleanHtml(content) }}');
  fs.writeFileSync('src/pages/NewsDetail.tsx', newsDetail);
}

// 3. Update RichContentBlocks.tsx
let rcb = fs.readFileSync('src/components/RichContentBlocks.tsx', 'utf8');
if (!rcb.includes('cleanHtml(')) {
  rcb = rcb.replace(/import \{ formatDriveLink \} from "\.\.\/lib\/utils";/, 'import { formatDriveLink, cleanHtml } from "../lib/utils";');
  rcb = rcb.replace(/dangerouslySetInnerHTML={{ __html: text }}/, 'dangerouslySetInnerHTML={{ __html: cleanHtml(text) }}');
  fs.writeFileSync('src/components/RichContentBlocks.tsx', rcb);
}

