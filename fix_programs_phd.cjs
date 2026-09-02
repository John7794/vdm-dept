const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const phdStart = `                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                  <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[\`Duration_\${lang}\`] || prog.Duration_UA || prog.duration}</span></span>
                  <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main">{prog[\`Degree_\${lang}\`] || prog.Degree_UA || prog.degree}</span></span>
                </div>
              </div>`;

const phdReplace = `                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                  <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[\`Duration_\${lang}\`] || prog.Duration_UA || prog.duration}</span></span>
                  <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main">{prog[\`Degree_\${lang}\`] || prog.Degree_UA || prog.degree}</span></span>
                </div>
                <ProgramDisciplines prog={prog} />
              </div>`;

content = content.replace(phdStart, phdReplace);
fs.writeFileSync('src/pages/Programs.tsx', content);
console.log("PhD fixed");
