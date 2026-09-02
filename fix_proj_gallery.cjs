const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDetail.tsx', 'utf8');

if (!content.includes('useState')) {
  content = `import { useState } from "react";\n` + content;
}
if (!content.includes('AnimatePresence')) {
  content = content.replace('import { motion }', 'import { motion, AnimatePresence }');
}
content = content.replace(
  'import { ArrowLeft } from "lucide-react";',
  'import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";'
);

fs.writeFileSync('src/pages/ProjectDetail.tsx', content);
