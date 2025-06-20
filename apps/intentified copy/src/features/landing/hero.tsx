"use client";

// External imports
import Link from "next/link";
import { ArrowRight, LineChart, TrendingUp, Users } from "lucide-react";

// Internal imports
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
// import { IntentSequenceMultipleInputs } from "../../components/intent-sequence-animated-beam/IntentSequenceMultipleInputs";
// import { DotPattern } from "@/components/dot-pattern";
// import { TrustedBySection } from "@/components/shared/TrustedBySection";

import { TrustedBySection } from "@/components/shared/TrustedBySection";

import React from "react";
import { AnimatePresence, motion, useAnimationFrame } from "motion/react";
import { useRef, useState } from "react";
import { TrueFocus } from "@/components/ui/true-focus";
import { GridBackgroundWithBlur } from "@/components/backgrounds/grid-backgrounds/grid-background-with-blur";
import { AnimatedUnderline } from "@/components/ui/animated-underline";

/**
 * HeroTitle component displaying the main heading with competitor traffic hijacking messaging
 */

/**
 * BadgeLabel component for displaying feature announcement badges
 */
export const BadgeLabel = ({ text }: { text: string }) => {
  return (
    <div
      className="bg-background-blur mb-6 inline-flex items-center gap-2 rounded-full border border-1 border-white/85 px-3 py-1 text-sm"
      role="note"
    >
      <span
        className="bg-primary flex h-2 w-2 rounded-full"
        aria-hidden="true"
      />
      <span className="text-muted-foreground text-xs font-medium">{text}</span>
    </div>
  );
};

/**
 * CTAButton component for consistent call-to-action buttons
 */
export const CTAButton = ({
  children,
  variant = "outline",
  href,
  icon,
  onClick,
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const buttonClass = cn(
    "h-16 px-8 text-base font-semibold tracking-wide uppercase sm:text-lg",
    variant === "outline" && "hover:bg-background/5 border-1",
    className,
  );

  const button = (
    <Button
      onClick={onClick}
      size="lg"
      variant={variant}
      className={buttonClass}
    >
      {icon && (
        <span
          className="-ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </Button>
  );

  if (href) {
    return <Link href={href}>{button}</Link>;
  }

  return button;
};

const BackgroundElements = () => {
  return (
    <>
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:12px_12px]"
        aria-hidden="true"
      />
      <div
        className="absolute top-[30%] right-[40%] z-[-10px] h-[400px] w-[400px] rounded-full bg-[turquoise]/10 blur-2xl"
        aria-hidden="true"
      ></div>
      <div
        className="bg-primary/20 absolute top-16 left-0 -z-10 h-36 w-36 rounded-full bg-[turquoise]/10 blur-2xl blur-3xl"
        aria-hidden="true"
      ></div>
    </>
  );
};

const HeroTitle = () => {
  return (
    <div className="relative">
      <h1 className="mt-8 inline-block max-w-6xl leading-none font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        <div className="relative">
          <span className="inline-block bg-black px-4 text-7xl font-semibold uppercase">
            From Signal to Sales
          </span>
          <BackgroundElements />
          <br />

          {/* <span className="relative mt-6 inline-block bg-black px-4 py-2 text-7xl font-semibold uppercase">
            <span className="uppercase">
              <TrueFocus
                sentence="The Competition Just Became Your Lead Gen"
                activeIndices={[0, 1, 3, 3, 6]}
                animationDuration={2}
                pauseBetweenAnimations={1}
                // manualMode={true}
              />
        
            </span>
          </span> */}
        </div>
      </h1>

      <div className="mt-16 block text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        <span className="relative inline-block px-4 py-2 uppercase">
          <h2
            className="lg:text-5x block max-w-6xl text-center !font-extrabold uppercase sm:text-5xl md:text-4xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: "Geist Mono",
              fontWeight: "600",
              fontStyle: "italic",
            }}
          >
            <span className="uppercase">
              <TrueFocus
                sentence="The Competition Just Became Your Lead Gen"
                activeIndices={[0, 1, 3, 3, 6]}
                animationDuration={2}
                pauseBetweenAnimations={1}
                // manualMode={true}
              />
            </span>
          </h2>
        </span>
      </div>
    </div>
  );
};

export function Hero() {
  return (
    // <Modal>
    <section
      className="relative w-full overflow-hidden"
      id="home"
      aria-labelledby="hero-heading"
    >
      {/* Background elements */}

      {/* <GridBackgroundWithBlur /> */}
      {/* <GridBackgroundWithBlur /> */}
      <BackgroundElements />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <BadgeLabel text="100% legal and compliant" />

          <HeroTitle />

          <p className="text-muted-foreground mt-16 max-w-3xl text-center text-xl font-normal">
            We track billions of online interactions every second, sending
            real-time emails to people actively searching for what you sell
          </p>

          <p className="text-muted-foreground font-geist-mono mt-12 max-w-4xl text-center text-lg font-normal">
            Using{" "}
            <span className="text-foreground font-semibold">
              1.9 trillion intent signals
            </span>{" "}
            from 270 million US consumers, we identify and target your
            competitors&apos; active visitors—delivering{" "}
            <span className="text-foreground font-semibold">
              60-70% visitor matching
            </span>{" "}
            with{" "}
            <span className="text-foreground font-semibold">
              real-time data
            </span>{" "}
            from thousands of databases.
          </p>

          <div className="relative mt-16 flex flex-col gap-5 sm:flex-row sm:gap-6">
            {/* Decorative elements around buttons */}
            <div
              className="border-primary/90 absolute -top-4 -left-4 h-4 w-4 border-t-2 border-l-2"
              aria-hidden="true"
            />
            <div
              className="border-primary/90 absolute -right-4 -bottom-4 h-4 w-4 border-r-2 border-b-2"
              aria-hidden="true"
            />

            <CTAButton
              variant="outline"
              className="text-white"
              icon={<ArrowRight className="h-4 w-4 !bg-transparent" />}
            >
              {/* <ModalTrigger asChild> */}
              <span data-modal-trigger>START CAPTURING COMPETITOR TRAFFIC</span>
              {/* </ModalTrigger> */}
            </CTAButton>

            <CTAButton
              variant="default"
              icon={<LineChart className="h-4 w-4" />}
            >
              SEE HOW IT WORKS
            </CTAButton>
          </div>
        </div>
        {/* <GridBackgroundWithBlur /> */}
        <div
          className="border-border/50 bg-background/50 mt-24 flex flex-wrap items-center justify-center gap-6 rounded-lg border bg-black p-4 sm:gap-10 md:gap-16"
          aria-label="Key statistics"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <TrendingUp className="text-primary h-4 w-4" aria-hidden="true" />
              <p className="text-lg font-bold">1.9T</p>
            </div>
            <p className="text-muted-foreground text-xs font-medium">
              Intent signals tracked
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <LineChart
                className="h-4 w-4 text-yellow-500"
                aria-hidden="true"
              />
              <p className="text-lg font-bold">50B</p>
            </div>
            <p className="text-muted-foreground text-xs font-medium">
              URLs monitored daily
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Users className="h-4 w-4 text-green-500" aria-hidden="true" />
              <p className="text-lg font-bold">60-70%</p>
            </div>
            <p className="text-muted-foreground text-xs font-medium">
              Visitor matching rate
            </p>
          </div>
        </div>
      </div>
      {/* <TrustedBySection /> */}
      {/* Trusted by section */}
    </section>
    //   <ModalBody className="bg-background/95 overflow-y-auto backdrop-blur-sm">
    //     <ModalContent className="bg-background border-border mx-auto w-full border shadow-lg">
    //       <LeadTargetingForm />
    //     </ModalContent>
    //   </ModalBody>
    // </Modal>
  );
}
