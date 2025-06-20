"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "@/components/ui/border-beam";

export interface AccordionFeatureItem {
  id: string;
  icon: LucideIcon;
  title: string;
  content: string;
  image: {
    src: string;
    alt: string;
  };
}

export interface AccordionFeaturesProps {
  heading: string;
  description: string;
  items: AccordionFeatureItem[];
  defaultActiveItem?: string;
  className?: string;
}

export default function AccordionFeatures({
  heading,
  description,
  items,
  defaultActiveItem,
  className = "",
}: AccordionFeaturesProps) {
  const [activeItem, setActiveItem] = useState<string>(
    defaultActiveItem || (items[0]?.id ?? ""),
  );

  const activeImage = items.find((item) => item.id === activeItem)?.image;

  return (
    <section className={`py-12 md:py-20 lg:py-32 ${className}`}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-900 to-zinc-950 sm:inset-6 sm:rounded-b-3xl"></div>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-4xl font-semibold text-balance text-white lg:text-6xl">
            {heading}
          </h2>
          <p className="text-zinc-300">{description}</p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value)}
            className="w-full"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-zinc-700"
                >
                  <AccordionTrigger className="text-white hover:text-zinc-200 data-[state=open]:text-white">
                    <div className="flex items-center gap-2 text-base">
                      <Icon className="size-4" />
                      {item.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-300">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="relative flex overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-800 p-2">
            <div className="absolute inset-0 right-0 ml-auto w-15 border-l border-zinc-700 bg-[repeating-linear-gradient(-45deg,transparent,transparent_1px,rgba(255,255,255,0.05)_1px,rgba(255,255,255,0.05)_8px)]"></div>
            <div className="relative aspect-[76/59] w-[calc(3/4*100%+3rem)] rounded-2xl bg-zinc-900">
              <AnimatePresence mode="wait">
                {activeImage && (
                  <motion.div
                    key={`${activeItem}-id`}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="size-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 shadow-md"
                  >
                    <Image
                      src={activeImage.src}
                      className="size-full object-cover object-left-top"
                      alt={activeImage.alt}
                      width={1207}
                      height={929}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
