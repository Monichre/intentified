"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import ProjectModal from "./project-modal";

interface CardProps {
  title: string;
  year: string;
  month: string;
  description: string;
  href?: string;
  extendedDescription?: ReactNode;
}

export const Card = ({
  title,
  year,
  month,
  description,
  href = "#",
  extendedDescription
}: CardProps) => {
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

  const CardWrapper = ({ children }: { children: ReactNode }) => {
    return (
      <div
        className="flex flex-col relative max-h-96 h-full group cursor-pointer"
        onClick={handleCardClick}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      <CardWrapper>
        <div className="absolute -inset-2 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 min-w-full min-h-full rounded-lg bg-neutral-700/20 transition-all cursor-pointer pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center w-full space-y-2 md:space-y-0 md:space-x-4 z-10 relative">
          <p className="text-sm font-semibold text-zinc-200 font-geistSans text-nowrap underline decoration-wavy decoration-neutral-800 underline-offset-4 group-hover:decoration-neutral-700 transition-colors">
            {title}
          </p>
          <div className="hidden md:block w-full h-0.5 bg-neutral-700 rounded-full"></div>
          <p className="text-xs font-semibold text-neutral-500 font-geistMono text-nowrap">
            {year} - {month}
          </p>
        </div>
        <p className="text-xs font-semibold text-neutral-500 font-geistMono mt-2">
          {description}
        </p>
      </CardWrapper>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={title}
        year={year}
        month={month}
        description={description}
        extendedDescription={extendedDescription}
      />
    </>
  );
};

export default Card;
