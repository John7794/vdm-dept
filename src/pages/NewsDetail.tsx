import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

export default function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'news', id), (snapshot) => {
      if (snapshot.exists()) {
        setNewsItem({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `news/${id}`);
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

  if (!newsItem) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-page-bg text-text-main p-12">
        <h1 className="text-4xl font-bold uppercase mb-4">Новину не знайдено</h1>
        <Link to="/news" className="border-2 border-border-main px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-text-main hover:text-page-bg transition-colors">
          Повернутися до новин
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-page-bg text-text-main min-h-screen">
      {/* Top Banner / Breadcrumb */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 lg:px-12 flex items-center">
        <Link to="/news" className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Всі новини
        </Link>
      </section>

      {/* Article Header */}
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-border-main flex flex-col items-center text-center">
        <div className="max-w-4xl w-full">
          <div className="flex justify-center gap-4 mb-8">
            <span className="font-mono text-sm font-bold tracking-tighter">{newsItem.date}</span>
            <span className="font-mono text-[10px] sm:text-xs text-text-dim border border-border-soft px-3 py-1 uppercase">{newsItem.type}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[0.9] tracking-[-0.04em] uppercase text-balance"
          >
            {newsItem.title}
          </motion.h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main">
        {/* Main Body */}
        <div className="lg:col-span-8 p-6 md:p-12 lg:p-16 lg:col-start-3">
          <div className="max-w-3xl mx-auto space-y-8 font-light leading-relaxed text-text-main text-lg lg:text-xl">
            <p className="font-medium text-xl lg:text-2xl italic pb-8 border-b border-border-soft text-balance">
              {newsItem.excerpt}
            </p>
            {newsItem.content ? (
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} className="prose prose-invert max-w-none prose-p:text-text-main prose-headings:text-text-main" />
            ) : (
              <p>
                Повний текст новини очікує на публікацію. Наша пресслужба працює над підготовкою детальних матеріалів та фотозвіту з цієї події.
              </p>
            )}
            {newsItem.gallery && newsItem.gallery.length > 0 && (
              <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-border-soft mt-12">
                {newsItem.gallery.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`Gallery image ${idx}`} className="w-full aspect-[4/3] object-cover border-2 border-border-main" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
