const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// 1. Fix "Дисципліни" and "Завантажити програму (PDF)" header
content = content.replace(
  '<div className="p-4 border-b border-border-soft flex justify-between items-center bg-surface-mut">',
  '<div className="p-4 border-b border-border-soft flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 bg-surface-mut">'
);
content = content.replace(
  '<h4 className="font-bold text-sm tracking-widest uppercase">{t("prog_lbl_disciplines", "Дисципліни")}</h4>',
  '<h4 className="font-bold text-sm tracking-widest uppercase">{t("prog_lbl_disciplines", "Дисципліни")}</h4>' // Actually this might be same, but just replacing the wrapper is enough.
);

// 2. Fix duration and degree layout
content = content.replace(
  /<div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">/g,
  '<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">'
);

// We need to change the spans. 
// <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
// to:
// <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
content = content.replace(
  /<span className="text-text-main">\{prog\[\`Duration_\$\{lang\}\`\] \|\| prog\.Duration_UA \|\| prog\.duration\}<\/span>/g,
  '<span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span>'
);

content = content.replace(
  /<span className="text-text-main">\{prog\[\`Degree_\$\{lang\}\`\] \|\| prog\.Degree_UA \|\| prog\.degree\}<\/span>/g,
  '<span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span>'
);

// 3. Fix the table to be responsive
const tableStartRegex = /<div className="overflow-x-auto bg-surface-main\/30 border border-border-soft">[\s\S]*?<table className="w-full text-left text-sm min-w-\[600px\]">/;
const theadRegex = /<thead className="font-mono text-xs text-text-dim border-b border-border-soft bg-surface-mut\/50">[\s\S]*?<\/thead>/;
const tbodyStartRegex = /<tbody className="divide-y divide-border-soft\/30">/;
const trRegex = /<tr key=\{i\} className="hover:bg-surface-mut transition-colors group">[\s\S]*?<\/tr>/g;

content = content.replace(tableStartRegex, '<div className="bg-surface-main/30 border border-border-soft">');
content = content.replace(theadRegex, 
  `<div className="hidden sm:grid grid-cols-[1fr_120px_180px] font-mono text-xs text-text-dim border-b border-border-soft bg-surface-mut/50 p-4">
    <div>{lang === "UA" ? "Назва дисципліни" : "Discipline"}</div>
    <div className="text-center">{lang === "UA" ? "Семестр" : "Semester"}</div>
    <div>{lang === "UA" ? "Тип контролю" : "Control Type"}</div>
  </div>`
);
content = content.replace(tbodyStartRegex, '<div className="divide-y divide-border-soft/30">');
content = content.replace(/<\/tbody>\s*<\/table>/, '</div>');

content = content.replace(trRegex, (match) => {
  return `<div key={i} className="hover:bg-surface-mut transition-colors group p-4">
                      <div className="text-sm mb-3 sm:hidden text-text-main leading-snug pr-4">{nameStr}</div>
                      
                      <div className="hidden sm:grid sm:grid-cols-[1fr_120px_180px] sm:items-center">
                        <div className="text-sm pr-4">{nameStr}</div>
                        <div className="text-center font-mono text-xs">{semStr}</div>
                        <div className="font-mono text-xs text-text-dim leading-tight">{ctrlStr}</div>
                      </div>

                      <div className="flex sm:hidden items-center gap-4 text-xs font-mono text-text-dim">
                        <span className="bg-surface-mut px-2 py-1 border border-border-soft whitespace-nowrap">{semStr}</span>
                        <span className="leading-tight">{ctrlStr}</span>
                      </div>
                    </div>`;
});


fs.writeFileSync('src/pages/Programs.tsx', content);
