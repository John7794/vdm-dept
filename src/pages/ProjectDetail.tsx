import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'projects', id), (snapshot) => {
      if (snapshot.exists()) {
        setProject({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `projects/${id}`);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-page-bg text-text-main font-mono uppercase tracking-widest text-sm">
        Завантаження...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-page-bg text-text-main p-12">
        <h1 className="text-4xl font-bold uppercase mb-4">Проєкт не знайдено</h1>
        <Link to="/projects" className="border-2 border-border-main px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-text-main hover:text-page-bg transition-colors">
          Повернутися до архіву
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-page-bg text-text-main min-h-screen">
      {/* Top Banner / Breadcrumb */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 lg:px-12 flex items-center">
        <Link to="/projects" className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Архів проєктів
        </Link>
      </section>

      {/* Project Header */}
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-border-main">
        <div className="max-w-4xl">
          <div className="flex gap-4 mb-6">
            <span className="font-mono text-[10px] sm:text-xs text-text-dim border border-border-soft px-3 py-1 uppercase">{project.type}</span>
            <span className="font-mono text-[10px] sm:text-xs text-text-main uppercase font-bold border border-border-main px-3 py-1">{project.year}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-[6rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance mb-12"
          >
            {project.title}
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row gap-8 font-mono text-sm uppercase tracking-widest border-t-2 border-border-main pt-8">
            <div>
              <span className="text-text-dim block mb-1">Студент(ка)</span>
              <span className="font-bold">{project.student}</span>
            </div>
            {project.course && (
              <div>
                <span className="text-text-dim block mb-1">Дисципліна</span>
                <span className="font-bold">{project.course || "Дизайн-проєктування"}</span>
              </div>
            )}
            {project.curator && (
              <div>
                <span className="text-text-dim block mb-1">Куратор</span>
                <span className="font-bold">{project.curator || "Не вказано"}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main">
        {/* Main images */}
        <div className="lg:col-span-8 p-6 md:p-12 space-y-12 bg-ink">
          {project.img ? (
            <img src={project.img} alt={project.title} className="w-full h-auto border-2 border-border-main object-cover" />
          ) : (
            <div className="aspect-video w-full border-2 border-border-main flex items-center justify-center bg-surface-main">
              <span className="font-mono text-xs uppercase tracking-widest text-text-dim">Зображення відсутнє</span>
            </div>
          )}
          {project.additionalImages?.map((imgUrl: string, idx: number) => (
            <img key={idx} src={imgUrl} alt={`${project.title} detail ${idx + 1}`} className="w-full h-auto border-2 border-border-main object-cover" />
          ))}
        </div>
        
        {/* Project info sidebar */}
        <div className="lg:col-span-4 p-6 md:p-12 bg-surface-main">
          <div className="sticky top-20">
            <span className="font-mono text-xs text-text-dim block mb-6 uppercase tracking-widest">Про проєкт</span>
            <div className="prose prose-invert max-w-none font-light leading-relaxed text-text-main opacity-90 text-sm md:text-base">
              {project.description ? (
                <p>{project.description}</p>
              ) : (
                <p>Детальний опис проєкту ще не оновлено в базі даних. Цей простір передбачено для рефлексії студента над процесом розробки, обґрунтування дизайн-рішень та демонстрації дослідницької складової проєкту.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
