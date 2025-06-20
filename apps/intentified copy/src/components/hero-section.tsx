import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@repo/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@repo/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@repo/components/motion-primitives/animated-group";
import { HeroHeader } from "@repo/design-system/components/header";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden contain-strict lg:block"
        >
          <div className="absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          <div className="absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mt-0 lg:mr-auto">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 max-w-2xl text-5xl font-medium text-balance md:text-6xl lg:mt-16"
                >
                  Build and Ship 10x faster with NS
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mt-8 max-w-2xl text-lg text-pretty"
                >
                  Tailwindcss highly customizable components for building modern
                  websites and applications that look and feel the way you mean
                  it.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex items-center gap-2"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="#link">
                        <span className="text-nowrap">Start Building</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5 text-base"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-8 -mr-56 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20">
                <div
                  aria-hidden
                  className="to-background absolute inset-0 z-10 bg-linear-to-b from-transparent from-35%"
                />
                <div className="ring-background bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 dark:inset-shadow-white/20">
                  <Image
                    className="bg-background relative hidden aspect-15/8 rounded-2xl dark:block"
                    src="/mail2.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="border-border/25 relative z-2 aspect-15/8 rounded-2xl border dark:hidden"
                    src="/mail2-light.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pt-16 pb-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="/"
                className="block text-sm duration-150 hover:opacity-75"
              >
                <span> Meet Our Customers</span>

                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 group-hover:blur-xs sm:gap-x-16 sm:gap-y-14">
              <div className="flex">
                <img
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nvidia.svg"
                  alt="Nvidia Logo"
                  height="20"
                  width="auto"
                />
              </div>

              <div className="flex">
                <img
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/column.svg"
                  alt="Column Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/github.svg"
                  alt="GitHub Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/nike.svg"
                  alt="Nike Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-5 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                  alt="Lemon Squeezy Logo"
                  height="20"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-4 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/laravel.svg"
                  alt="Laravel Logo"
                  height="16"
                  width="auto"
                />
              </div>
              <div className="flex">
                <img
                  className="mx-auto h-7 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/lilly.svg"
                  alt="Lilly Logo"
                  height="28"
                  width="auto"
                />
              </div>

              <div className="flex">
                <img
                  className="mx-auto h-6 w-fit dark:invert"
                  src="https://html.tailus.io/blocks/customers/openai.svg"
                  alt="OpenAI Logo"
                  height="24"
                  width="auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
