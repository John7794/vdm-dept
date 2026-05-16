import { motion } from "motion/react";

export default function About() {
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
            Про<br />
            Кафедру.
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main">
            Історичний контекст та сучасна матеріально-технічна база для формування фахівців майбутнього.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        
        {/* Left Column: History Narrative */}
        <div className="lg:col-span-8 bg-surface-main">
          <div className="p-6 md:p-12 lg:p-16 max-w-3xl">
            <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">Контекст</span>
            
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 leading-none">
              Архітектурна спадщина та цифровий авангард
            </h2>
            
            <div className="space-y-6 text-lg font-light leading-relaxed text-text-main text-balance">
              <p>
                Кафедра візуального дизайну і мистецтва є невід'ємною частиною Інституту архітектури та дизайну Національного університету «Львівська політехніка». Ми базуємося на глибоких традиціях львівської архітектурної школи, трансформуючи їх у мову сучасного візуального проєктування.
              </p>
              <p>
                Наш підхід полягає у відмові від суто художнього оздоблення на користь функціонального комунікативного дизайну. Ми вчимо не просто створювати зображення, а проєктувати інформаційні системи, керувати увагою та формувати сенси через візуальну мову.
              </p>
              <p className="border-l-4 border-border-main pl-6 italic font-medium mt-8">
                "Дизайн — це не те, як предмет виглядає, а те, як він працює."
              </p>
            </div>
            
            {/* Image Placeholder */}
            <div className="mt-12 aspect-[16/9] w-full bg-ink relative overflow-hidden brutal-grid opacity-80 flex items-center justify-center">
              <span className="font-mono text-paper uppercase tracking-widest text-sm bg-ink px-4 py-2">
                Архівне фото корпусу N (Placeholder)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Infrastructure Data */}
        <div className="lg:col-span-4 bg-ink text-paper">
          <div className="p-6 md:p-12 sticky top-20">
            <span className="font-mono text-xs text-paper/50 block mb-8 uppercase tracking-widest">Інфраструктура</span>
            
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-12">Матеріально-технічна база</h2>
            
            <ul className="space-y-8">
              <li className="group pointer-events-none">
                <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-accent-yellow">01. Апаратне забезпечення</h3>
                <p className="font-light text-sm text-paper/70 leading-relaxed group-hover:text-paper transition-colors">
                  Комп'ютерні лабораторії, обладнані робочими станціями з високою продуктивністю для рендерингу та 3D-моделювання. Графічні планшети Wacom Cintiq для цифрового живопису.
                </p>
              </li>
              <li className="group pointer-events-none">
                <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-accent-yellow">02. Програмний комплекс</h3>
                <p className="font-light text-sm text-paper/70 leading-relaxed group-hover:text-paper transition-colors">
                  Ліцензійний доступ до Adobe Creative Cloud, Figma Education Plan, Autodesk 3ds Max, Blender, Cinema 4D.
                </p>
              </li>
              <li className="group pointer-events-none">
                <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-accent-yellow">03. Макетні майстерні</h3>
                <p className="font-light text-sm text-paper/70 leading-relaxed group-hover:text-paper transition-colors">
                  Простір для роботи з матеріалами, 3D-друк (FDM та SLA технології), лазерна різка для прототипування пакувань та просторових об'єктів.
                </p>
              </li>
              <li className="group pointer-events-none">
                <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-accent-yellow">04. Фотостудія</h3>
                <p className="font-light text-sm text-paper/70 leading-relaxed group-hover:text-paper transition-colors">
                  Студійне освітлення, циклорама, предметні столи для зйомки портфоліо та фізичних артефактів дизайну.
                </p>
              </li>
            </ul>
          </div>
        </div>

      </section>
    </div>
  );
}
