import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxModalProps {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function LightboxModal({ images, index, onClose, onNavigate }: LightboxModalProps) {
  const isOpen = index !== null && images.length > 0 && index >= 0 && index < images.length;

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (index === null || images.length <= 1) return;
      onNavigate((index - 1 + images.length) % images.length);
    },
    [index, images.length, onNavigate]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (index === null || images.length <= 1) return;
      onNavigate((index + 1) % images.length);
    },
    [index, images.length, onNavigate]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out group/lightbox"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-paper/70 hover:text-accent-yellow transition-colors focus-ring outline-none z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <X className="w-10 h-10" />
          </button>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-paper/40 hover:text-accent-yellow transition-all duration-300 focus-ring outline-none z-[110] opacity-0 group-hover/lightbox:opacity-100 hover:scale-110"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-12 h-12 md:w-16 md:h-16" />
            </button>
          )}

          {/* Animated Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={images[index]}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </AnimatePresence>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-paper/40 hover:text-accent-yellow transition-all duration-300 focus-ring outline-none z-[110] opacity-0 group-hover/lightbox:opacity-100 hover:scale-110"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="w-12 h-12 md:w-16 md:h-16" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
