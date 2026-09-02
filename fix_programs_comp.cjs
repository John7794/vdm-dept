const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

content = `import { disciplinesData } from "../data/disciplines";\n` + content;

const oldComp = `function ProgramDisciplines({ prog }: { prog: any }) {
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

const newComp = `function ProgramDisciplines({ prog }: { prog: any }) {
  const progDisciplines = disciplinesData.filter(d => d.program === prog.matchName);
  
  if (!progDisciplines || progDisciplines.length === 0) return null;
  
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
              <th className="p-4 font-normal border-b border-border-soft w-32">Тип контролю</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft/30">
            {progDisciplines.map((d: any, i: number) => (
              <tr key={i} className="hover:bg-surface-mut transition-colors">
                <td className="p-4">{d.name}</td>
                <td className="p-4 text-center font-mono text-xs whitespace-nowrap">{d.semester}</td>
                <td className="p-4 font-mono text-xs text-text-dim leading-tight">{d.control}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`;

content = content.replace(oldComp, newComp);

// Also remove duplicate <ProgramDisciplines prog={prog} /> blocks
// We can use a regex to replace two consecutive blocks with one.
content = content.replace(/<ProgramDisciplines prog=\{prog\} \/>\s*<ProgramDisciplines prog=\{prog\} \/>/g, '<ProgramDisciplines prog={prog} />');

fs.writeFileSync('src/pages/Programs.tsx', content);
