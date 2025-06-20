"use client";

import { useEffect, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  year: string;
  month: string;
  description: string;
  extendedDescription?: ReactNode;
}

export const ProjectModal = ({
  isOpen,
  onClose,
  title,
  year,
  month,
  description,
  extendedDescription = ""
}: ProjectModalProps) => {
  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl bg-neutral-900 text-zinc-200 p-4 sm:p-6 mx-auto rounded-md max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pr-8">
              <div className="flex flex-col sm:flex-row sm:items-center w-full space-y-2 sm:space-y-0 sm:space-x-4 z-10 relative mb-2">
                <p className="text-lg sm:text-xl font-semibold text-zinc-200 font-geistSans text-nowrap underline decoration-wavy decoration-neutral-800 underline-offset-4">
                  {title}
                </p>
                <div className="hidden sm:block w-full h-0.5 bg-neutral-700 rounded-full"></div>
                <p className="text-xs font-semibold text-neutral-500 font-geistMono text-nowrap">
                  {year} - {month}
                </p>
              </div>

              <button
                className="absolute top-4 right-4 text-neutral-500 hover:text-zinc-200 transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="text-sm mt-6 sm:mt-8">
              <p className="text-xs font-semibold text-neutral-500 font-geistMono mb-3">
                {description}
              </p>

              <div className="text-base text-zinc-300 font-geistSans mt-6">
                {extendedDescription || (
                  <div>
                    <p>
                      {title} is a project that showcases my skills in creating professional, user-friendly interfaces.
                      I focused on building an intuitive experience while maintaining a clean, modern design.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="m14 12-4 4"/>
                            <path d="M10 8v8"/>
                          </svg>
                        </div>
                        <img
                          src="/seasons/flower.png"
                          alt=""
                          className="opacity-20 w-36 h-36 mx-auto my-8"
                        />
                      </div>
                    </div>
                    <p className="mt-4">
                      I used Next.js, TailwindCSS, and Framer Motion to create the website and the interactive elements.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
