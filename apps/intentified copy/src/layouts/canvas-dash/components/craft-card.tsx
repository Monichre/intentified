"use client";

import { useState } from "react";
import ProjectModal from "./project-modal";

interface CraftCardProps {
  title: string;
  description: string;
  href: string;
}

export const CraftCard = ({ title, description, href }: CraftCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal();
  };

  return (
    <>
      <div
        className="flex flex-col relative w-auto max-h-96 h-full group cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="absolute -inset-2 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 min-w-full min-h-full rounded-lg bg-neutral-700/20 transition-all cursor-pointer pointer-events-none"></div>
        <div className="flex items-center w-full space-x-4 z-10 relative">
          <p className="text-sm font-semibold text-zinc-200 font-geistSans text-nowrap underline decoration-wavy decoration-neutral-800 underline-offset-4 group-hover:decoration-neutral-700 transition-colors">
            {title}
          </p>
        </div>
        <p className="text-xs font-semibold text-neutral-500 font-geistMono mt-2">
          {description}
        </p>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={title}
        year="2024"
        month={title === "Gooey Menu" ? "01" : "02"}
        description={description}
        extendedDescription={
          <>
            <p>
              {title} is a UI component I created to showcase my design and animation skills. The goal was to create an elegant,
              intuitive interface that provides a delightful user experience.
            </p>
            <div className="mt-6 bg-neutral-800/50 p-4 rounded">
              <p className="text-xs font-semibold text-neutral-400 font-geistMono">
                This component would typically be integrated into a larger application to enhance usability and provide
                an engaging interaction for users.
              </p>
            </div>
            <div className="mt-6">
              <p>
                I built this using React with Framer Motion for animations, carefully crafting each interaction to feel
                natural and responsive. The design philosophy focuses on minimalism while maintaining visual appeal through
                subtle animations and thoughtful spacing.
              </p>
            </div>
          </>
        }
      />
    </>
  );
};

export default CraftCard;
