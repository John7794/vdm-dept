import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useCms } from "../contexts/CmsContext";
import { usePrivacyModal } from "../contexts/PrivacyModalContext";

export default function Contacts() {
  const { t } = useCms();
  const { openPrivacyModal } = usePrivacyModal();
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "feedbacks"), data);
      setFormState("success");
      form.reset();
    } catch (err) {
      console.error(err);
      setFormState("error");
    }
    
    setTimeout(() => setFormState("idle"), 3000);
  };

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance break-words hyphens-auto whitespace-pre-line"
          >
            {t("contact_page_title", "Контакти &\nЛокація.")}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main">
            {t("contact_page_desc", "Зв'яжіться з нами для обговорення академічних програм, партнерств або спільних проєктів.")}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        
        {/* Left Column: Contact Data & Map */}
        <div className="lg:col-span-7 bg-page-bg flex flex-col divide-y-2 divide-border-main">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-border-main">
            <div className="p-6 md:p-12">
              <span className="font-mono text-xs text-text-dim block mb-6 uppercase tracking-widest">
                {t("contact_address_label", "Адреса")}
              </span>
              <address className="not-italic text-lg md:text-xl font-medium leading-relaxed uppercase opacity-90 whitespace-pre-line">
                {t("contact_address_val", "М. Львів,\nВул. Січових Стрільців, 7\nАудиторія 204")}
              </address>
              <div className="mt-8">
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest font-bold hover:underline underline-offset-4 flex items-center gap-2">
                  {t("contact_maps_link", "Відкрити в Google Maps")} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="p-6 md:p-12 bg-surface-main">
              <span className="font-mono text-xs text-text-dim block mb-6 uppercase tracking-widest">
                {t("contact_communication_label", "Зв'язок")}
              </span>
              <div className="space-y-6 text-lg md:text-xl font-medium uppercase break-all">
                <div>
                  <span className="block font-mono text-[10px] text-text-dim mb-1">EMAIL:</span>
                  <a href="mailto:vdm.dept@lpnu.ua" className="hover:text-accent-blue transition-colors focus-ring rounded outline-none block py-1">
                    vdm.dept@lpnu.ua
                  </a>
                </div>
                <div>
                  <span className="block font-mono text-[10px] text-text-dim mb-1">
                    {t("contact_phone_label", "ТЕЛЕФОН:")}
                  </span>
                  <a href="tel:+380322582537" className="hover:text-accent-blue transition-colors focus-ring rounded outline-none block py-1">
                    +38 (032) 258-25-37
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Image Placeholder */}
          <div className="aspect-video w-full bg-ink relative overflow-hidden brutal-grid flex items-center justify-center p-6">
             <div className="absolute inset-0 opacity-40 mix-blend-luminosity" style={{backgroundImage: "url('https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg')", backgroundSize: "cover"}}></div>
             <div className="relative z-10 bg-surface-main text-text-main p-4 font-mono text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl border-2 border-border-main">
                <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse"></div>
                {t("contact_map_badge", "Локація на мапі")}
             </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-5 bg-surface-main p-6 md:p-12 border-t-2 lg:border-t-0 border-border-main">
          <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
            {t("contact_form_label", "Форма")}
          </span>
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-8 leading-none">
            {t("contact_form_title", "Напишіть нам")}
          </h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest block mb-2 font-bold opacity-80">
                {t("contact_form_name", "Ім'я")}
              </label>
              <input 
                type="text" 
                id="name" 
                name="name"
                className="w-full border-2 border-border-main p-4 text-sm font-medium focus-ring outline-none bg-transparent placeholder-text-dim"
                placeholder={t("contact_form_name_placeholder", "Введіть ваше ім'я")}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest block mb-2 font-bold opacity-80">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="w-full border-2 border-border-main p-4 text-sm font-medium focus-ring outline-none bg-transparent uppercase placeholder-text-dim"
                placeholder="EMAIL@ADDRESS.COM"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest block mb-2 font-bold opacity-80">
                {t("contact_form_message", "Повідомлення")}
              </label>
              <textarea 
                id="message" 
                name="message"
                rows={5}
                className="w-full border-2 border-border-main p-4 text-sm font-medium focus-ring outline-none bg-transparent resize-none placeholder-text-dim"
                placeholder={t("contact_form_message_placeholder", "Тема вашого звернення...")}
                required
              ></textarea>
            </div>
            
            <div className="flex items-start gap-2.5 pt-2 text-xs text-text-dim">
              <input 
                type="checkbox" 
                id="consent" 
                required 
                defaultChecked 
                className="mt-0.5 w-4 h-4 rounded-none border-2 border-border-main accent-text-main focus-ring cursor-pointer flex-shrink-0"
              />
              <label htmlFor="consent" className="cursor-pointer leading-tight font-sans">
                {t("contact_form_consent_pre", "Я даю згоду на обробку персональних даних згідно із")}{" "}
                <button
                  type="button"
                  onClick={openPrivacyModal}
                  className="underline font-bold text-text-main hover:text-accent-blue focus-ring cursor-pointer inline p-0 bg-transparent border-none text-xs"
                >
                  {t("contact_form_consent_law", "Законом України «Про захист персональних даних»")}
                </button>{" "}
                {t("contact_form_consent_post", "та Політикою конфіденційності.")}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={formState === "submitting" || formState === "success"}
              className="w-full bg-text-main text-page-bg font-bold uppercase tracking-widest py-5 px-6 transition-colors focus-ring outline-none enabled:hover:opacity-80 active:scale-[0.98] transform duration-150 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState === "submitting"
                ? t("contact_form_submitting", "Обробка...")
                : formState === "success"
                ? t("contact_form_success", "Надіслано!")
                : formState === "error"
                ? t("contact_form_error", "Помилка (Спробуйте знов)")
                : t("contact_form_send", "Відправити")}
            </button>
            <p className="font-mono text-[10px] text-text-dim mt-4 uppercase">
              {t("contact_form_note", "* Обробка запитів здійснюється за Київським часом у робочі дні університету.")}
            </p>
          </form>
        </div>

      </section>
    </div>
  );
}
