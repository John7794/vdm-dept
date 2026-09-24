import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useCms } from "../contexts/CmsContext";

interface AccessGateProps {
  onAccess: () => void;
  correctPassword?: string;
}

export default function AccessGate({ onAccess, correctPassword }: AccessGateProps) {
  const { t } = useCms();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const normalizedInput = password.trim().toLowerCase();
    const normalizedCorrect = (correctPassword || "").trim().toLowerCase();

    if (normalizedInput === normalizedCorrect) {
      localStorage.setItem("site_access", "granted");
      onAccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg p-6 text-text-main">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface-main border-2 border-border-main p-8 space-y-8"
      >
        <div className="text-center">
          <div className="inline-block p-4 border-2 border-border-main mb-6">
            <Lock className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            {t("gate_title", "Обмежений доступ")}
          </h1>
          <p className="mt-2 font-mono text-[10px] text-text-dim uppercase tracking-widest">
            {t("gate_desc", "Введіть пароль для перегляду прототипу сайту")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("gate_password_placeholder", "ПАРОЛЬ")}
              className={`w-full bg-surface-mut border-2 p-4 font-mono text-sm lowercase tracking-widest outline-none transition-colors ${
                error ? "border-red-500" : "border-border-soft focus:border-accent-blue"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? t("gate_hide_password", "Приховати пароль") : t("gate_show_password", "Показати пароль")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-text-main text-page-bg py-4 font-bold uppercase tracking-widest hover:bg-accent-blue transition-colors"
          >
            {t("gate_submit", "УВІЙТИ")}
          </button>
        </form>

        <p className="text-center font-mono text-[9px] text-text-dim uppercase leading-tight whitespace-pre-line">
          {t("gate_note", "Цей сайт знаходиться в стадії розробки.\nЗверніться до адміністратора за паролем.")}
        </p>
      </motion.div>
    </div>
  );
}
