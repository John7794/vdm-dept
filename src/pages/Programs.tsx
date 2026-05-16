import { motion } from "motion/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export default function Programs() {
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'programs'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setPrograms(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'programs');
    });
    return () => unsubscribe();
  }, []);

  const bPrograms = useMemo(() => programs.filter(p => p.level === "Бакалавріат"), [programs]);
  const mPrograms = useMemo(() => programs.filter(p => p.level === "Магістратура"), [programs]);
  const phdPrograms = useMemo(() => programs.filter(p => p.level === "Аспірантура"), [programs]);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance"
          >
            Освітні<br />
            Програми.
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main">
            Структурована архітектура навчання. Від фундаментальної теорії до комплексного проєктування цифрових та матеріальних артефактів.
          </p>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        
        {/* Bachelor Dashboard */}
        <div className="flex flex-col">
          <div className="bg-ink text-paper p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold uppercase tracking-widest">Бакалавріат</h2>
            <span className="font-mono text-sm">LEVEL 1</span>
          </div>
          
          <div className="p-6 md:p-12 flex-grow bg-surface-main">
            <div className="space-y-12">
              {bPrograms.length > 0 ? bPrograms.map((prog, idx) => (
                <div key={idx} className="group cursor-crosshair">
                  <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                    <div>
                      <span className="font-mono text-xs text-text-dim block mb-2">СПЕЦІАЛЬНІСТЬ {prog.code || prog.id}</span>
                      <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                        {prog.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors flex-shrink-0" />
                  </div>
                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">ТРИВАЛІСТЬ: <span className="text-text-main">{prog.duration}</span></span>
                    <span className="text-text-dim">СТУПІНЬ: <span className="text-text-main">{prog.degree}</span></span>
                  </div>
                </div>
              )) : (
                <div className="text-text-dim font-mono text-xs uppercase">Завантаження...</div>
              )}
            </div>
            
            <div className="mt-16 bg-page-bg p-8 border border-border-soft">
              <h4 className="font-bold uppercase tracking-widest mb-6">Компетенції випускника:</h4>
              <ul className="space-y-4">
                {(bPrograms[0]?.competencies || ["Володіння інструментами цифрового дизайну", "Розуміння принципів типографіки та композиції", "Здатність проєктувати інтерфейси користувача"]).map((skill: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Master Dashboard */}
        <div className="flex flex-col">
          <div className="bg-surface-mut text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest">Магістратура</h2>
            <span className="font-mono text-sm">LEVEL 2</span>
          </div>
          
          <div className="p-6 md:p-12 flex-grow bg-page-bg">
            <div className="space-y-12">
              {mPrograms.length > 0 ? mPrograms.map((prog, idx) => (
                <div key={idx} className="group cursor-crosshair">
                  <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                    <div>
                      <span className="font-mono text-xs text-text-dim block mb-2">СПЕЦІАЛЬНІСТЬ {prog.code || prog.id}</span>
                      <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                        {prog.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors flex-shrink-0" />
                  </div>
                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">ТРИВАЛІСТЬ: <span className="text-text-main">{prog.duration}</span></span>
                    <span className="text-text-dim">СТУПІНЬ: <span className="text-text-main">{prog.degree}</span></span>
                  </div>
                </div>
              )) : (
                 <div className="text-text-dim font-mono text-xs uppercase">Завантаження...</div>
              )}
            </div>
            
            <div className="mt-16 bg-surface-main p-8 border border-border-soft">
              <h4 className="font-bold uppercase tracking-widest mb-6">Спеціалізовані компетенції:</h4>
              <ul className="space-y-4">
                {(mPrograms[0]?.competencies || ["Арт-дирекшн та управління творчими командами", "Експертиза візуальної комунікації", "Методологія проєктування складних систем"]).map((skill: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-blue" />
                    <span className="leading-snug">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </section>

      {/* PhD Dashboard */}
      <section className="grid grid-cols-1 border-b-2 border-border-main">
        <div className="flex flex-col">
          <div className="bg-ink text-paper p-6 flex justify-between items-center border-b-2 border-ink">
            <h2 className="text-2xl font-bold uppercase tracking-widest">Аспірантура</h2>
            <span className="font-mono text-sm">LEVEL 3</span>
          </div>
          
          <div className="p-6 md:p-12 bg-surface-main">
            <div className="space-y-12 max-w-3xl">
              {phdPrograms.length > 0 ? phdPrograms.map((prog, idx) => (
                <div key={idx} className="group cursor-crosshair">
                <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                  <div>
                    <span className="font-mono text-xs text-text-dim block mb-2">СПЕЦІАЛЬНІСТЬ {prog.code || prog.id}</span>
                    <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                      {prog.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors flex-shrink-0" />
                </div>
                <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                  <span className="text-text-dim">ТРИВАЛІСТЬ: <span className="text-text-main">{prog.duration}</span></span>
                  <span className="text-text-dim">СТУПІНЬ: <span className="text-text-main">{prog.degree}</span></span>
                </div>
              </div>
              )) : (
                <div className="text-text-dim font-mono text-xs uppercase">Завантаження...</div>
              )}
            </div>
            
            <div className="mt-16 bg-surface-mut p-8 border border-border-soft max-w-3xl">
              <h4 className="font-bold uppercase tracking-widest mb-6">Академічно-дослідницькі вектори:</h4>
              <ul className="space-y-4">
                {(phdPrograms[0]?.competencies || ["Аналітичні дослідження в сучасному дизайні та мистецтві", "Експериментальна урбаністика та міський брендинг", "Інноваційні технології в дизайн-освіті"]).map((skill: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-blue" />
                    <span className="leading-snug">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
