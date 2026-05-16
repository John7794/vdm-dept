import { motion } from "motion/react";
import { Lock } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg p-6 text-text-main">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block p-4 border-2 border-border-main mb-8">
            <Lock className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Сайт на реконструкції</h1>
          <p className="font-mono text-xs text-text-dim uppercase tracking-widest leading-relaxed">
            Ми готуємо оновлення. Повертайтеся трохи пізніше, щоб побачити нову платформу кафедри дизайну.
          </p>
        </motion.div>
        
        <div className="pt-8 border-t border-border-soft">
          <p className="font-mono text-[10px] text-text-dim uppercase">
            © 2026 Кафедра дизайну НУ "Львівська Політехніка"
          </p>
        </div>
      </div>
    </div>
  );
}
