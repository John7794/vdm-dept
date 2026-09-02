const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const helperComp = `function ProgramDisciplines({ prog }: { prog: any }) {
  if (!prog.disciplines || prog.disciplines.length === 0) return null;
  return (
    <div className="mt-8 border border-border-soft bg-page-bg/50">
      <div className="p-4 border-b border-border-soft flex justify-between items-center bg-surface-mut">
        <h4 className="font-bold text-sm tracking-widest uppercase">Дисципліни</h4>
        <a href="#" className="font-mono text-xs hover:text-accent-blue transition-colors underline underline-offset-4 decoration-border-main hover:decoration-accent-blue">Завантажити програму (PDF)</a>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="font-mono text-xs text-text-dim sticky top-0 bg-page-bg/90 backdrop-blur">
            <tr>
              <th className="p-4 font-normal border-b border-border-soft">Назва дисципліни</th>
              <th className="p-4 font-normal border-b border-border-soft w-24 text-center">Семестр</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft/30">
            {prog.disciplines.map((d: any, i: number) => (
              <tr key={i} className="hover:bg-surface-mut transition-colors">
                <td className="p-4">{d.name}</td>
                <td className="p-4 text-center font-mono">{d.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`;

content = content.replace('export default function Programs() {', helperComp + '\n\nexport default function Programs() {');

// For Bachelor
const bachelorStart = `                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[\`Duration_\${lang}\`] || prog.Duration_UA || prog.duration}</span></span>
                    <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main">{prog[\`Degree_\${lang}\`] || prog.Degree_UA || prog.degree}</span></span>
                  </div>`;
const bachelorRepl = bachelorStart + `\n                  <ProgramDisciplines prog={prog} />`;

content = content.replace(bachelorStart, bachelorRepl);

// Wait, the string is the same for Bachelor, Master, PhD!
// Let's replace globally.
content = content.split(bachelorStart).join(bachelorRepl);

fs.writeFileSync('src/pages/Programs.tsx', content);
