import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

const GROUP_ORDER = [
  "Керівництво",
  "Професура",
  "Доценти",
  "Старші викладачі",
  "Асистенти",
  "Адміністративно-господарський персонал"
];

function getGroupFromRole(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("завідувач") || r.includes("керівник") || r.includes("декан")) return "Керівництво";
  if (r.includes("професор")) return "Професура";
  if (r.includes("доцент")) return "Доценти";
  if (r.includes("старший викладач")) return "Старші викладачі";
  if (r.includes("асистент")) return "Асистенти";
  return "Адміністративно-господарський персонал";
}

export default function Staff() {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'staff'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        items.push({ 
          id: doc.id, 
          ...data,
          interests: Array.isArray(data.interests) ? data.interests : []
        });
      });
      setStaffMembers(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'staff');
    });
    return () => unsubscribe();
  }, []);

  const groupedStaff = useMemo(() => {
    const groups: Record<string, any[]> = {};
    staffMembers.forEach(member => {
      const groupName = member.group || getGroupFromRole(member.role);
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(member);
    });

    return Object.entries(groups)
      .map(([name, members]) => ({ name, members }))
      .sort((a, b) => {
        const indexA = GROUP_ORDER.indexOf(a.name);
        const indexB = GROUP_ORDER.indexOf(b.name);
        if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
  }, [staffMembers]);

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
            Академічний<br />
            Склад.
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main">
            Колектив дослідників та практиків. Наукометричні профілі та професійна експертиза.
          </p>
        </div>
      </section>

      {/* Staff Grid/Table */}
      <section className="bg-surface-main">
        {groupedStaff.map((group, gIdx) => (
          <div key={gIdx} className="border-b-2 border-border-main last:border-0">
            {/* Group Header */}
            <div className="bg-page-bg px-6 py-8 md:px-12 border-b-2 border-border-main sticky top-0 z-10">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-text-main">
                {group.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 divide-y-2 divide-border-main">
              {/* Header Row (Desktop) */}
              <div className="hidden lg:grid grid-cols-12 divide-x-2 divide-border-main font-mono text-xs uppercase tracking-widest bg-page-bg/50">
                <div className="col-span-5 p-4 text-text-dim">Прізвище, Ім'я, По батькові</div>
                <div className="col-span-3 p-4 text-text-dim">Науковий ступінь / Звання</div>
                <div className="col-span-3 p-4 text-text-dim">Вектор досліджень</div>
                <div className="col-span-1 p-4 text-text-dim flex items-center justify-center">Профіль</div>
              </div>
              
              {/* Staff Rows */}
              {group.members.map((member: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-soft lg:divide-border-main hover:bg-text-main hover:text-page-bg transition-colors cursor-crosshair pb-6 lg:pb-0"
                >
                  <div className="col-span-5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mb-2 uppercase w-full">Співробітник</span>
                    {/* Staff Photo */}
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-ink rounded-full overflow-hidden flex-shrink-0 border-2 border-border-main group-hover:border-page-bg transition-colors">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100 transition-all" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-paper uppercase tracking-widest bg-ink">Photo</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-none group-hover:text-accent-yellow transition-colors">
                        {member.name}
                      </h3>
                      <p className="font-mono text-xs mt-2 text-text-dim group-hover:text-page-bg/70">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-3 p-6 flex items-center">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mb-2 block uppercase w-full">Ступінь</span>
                    <p className="font-medium text-sm lg:text-base">{member.degree}</p>
                  </div>
                  
                  <div className="col-span-3 p-6 flex flex-col justify-center">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mb-2 uppercase">Сфера інтересів</span>
                    <div className="flex flex-wrap gap-2">
                      {member.interests && member.interests.map((interest: string, i: number) => (
                        <span 
                          key={i} 
                          className="inline-block px-2 py-1 text-xs border border-border-soft group-hover:border-page-bg/30 whitespace-nowrap rounded-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="col-span-1 p-6 flex items-center lg:justify-center">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mr-4 uppercase">Відкрити профіль</span>
                    <button className="w-12 h-12 flex items-center justify-center border-2 border-border-main group-hover:border-transparent rounded-full group-hover:bg-page-bg group-hover:text-text-main transition-all group-focus-visible:ring-4 group-focus-visible:ring-accent-blue outline-none" aria-label={`Профіль ${member.name}`}>
                      <ArrowUpRight className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {staffMembers.length === 0 && (
          <div className="p-12 text-center text-text-dim font-mono uppercase tracking-widest text-sm">
            Немає даних. (Спробуйте оновити сторінку або перевірте базу даних)
          </div>
        )}
      </section>
      
      {/* Footer Info */}
      <section className="p-6 md:p-12 border-t-2 border-border-main bg-surface-mut text-text-main font-mono text-xs uppercase tracking-widest text-center">
        Повні науково-методичні профілі інтегруються з бази даних Львівської Політехніки.
      </section>
    </div>
  );
}
