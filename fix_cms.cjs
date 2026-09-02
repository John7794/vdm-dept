const fs = require('fs');
let content = fs.readFileSync('src/contexts/CmsContext.tsx', 'utf8');

// Add to interface
content = content.replace(
  /projects: any\[\];\n  applicantssteps: any\[\];/g,
  'projects: any[];\n  disciplines: any[];\n  applicantssteps: any[];'
);

// Add to sheets array
content = content.replace(
  /const sheets = \["Static", "News", "Staff", "Programs", "Projects", "ApplicantsSteps"/g,
  'const sheets = ["Static", "News", "Staff", "Programs", "Projects", "Disciplines", "ApplicantsSteps"'
);

fs.writeFileSync('src/contexts/CmsContext.tsx', content);
