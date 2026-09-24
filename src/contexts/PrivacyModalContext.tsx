import React, { createContext, useContext, useState, useEffect } from "react";

interface PrivacyModalContextType {
  isOpen: boolean;
  openPrivacyModal: () => void;
  closePrivacyModal: () => void;
}

const PrivacyModalContext = createContext<PrivacyModalContextType | undefined>(undefined);

export function PrivacyModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPrivacyModal = () => setIsOpen(true);
  const closePrivacyModal = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closePrivacyModal();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <PrivacyModalContext.Provider value={{ isOpen, openPrivacyModal, closePrivacyModal }}>
      {children}
    </PrivacyModalContext.Provider>
  );
}

export function usePrivacyModal() {
  const context = useContext(PrivacyModalContext);
  if (!context) {
    throw new Error("usePrivacyModal must be used within a PrivacyModalProvider");
  }
  return context;
}
