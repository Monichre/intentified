"use client";

import {
  Activity,
  ArrowRight,
  DraftingCompass,
  Mail,
  Plus,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { IntentFeaturesSection } from "./intent-features-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MultiStepForm } from "@/components/ai-form-flow/multi-step-form";
import { COMPETITOR_ANALYSIS_STEPS } from "@/app/dashboard/onboarding/components/onboarding-steps";

// Export the new component as Features for backward compatibility
export const Features = IntentFeaturesSection;

// Keep the existing FeaturesSection component
export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
          <div className="lg:col-span-2">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl font-semibold lg:text-5xl">
                Real-time intent tracking
              </h2>
              <p className="mt-6"></p>
            </div>
            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <Mail className="size-5" />
                Powered by billions of intent signals
              </li>
              <li>
                <Zap className="size-5" />
                Real-time intent tracking
              </li>
              <li>
                <Activity className="size-5" />
                Competitor insights
              </li>
              <li>
                <DraftingCompass className="size-5" />
                Seamless integrations
              </li>
            </ul>
          </div>
          <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
            <div className="relative aspect-76/59 rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/payments.webp"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/payments.webp"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IntegrationFeaturesSection() {
  return (
    <section>
      <div className="bg-black py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-md [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] px-6">
            <div className="bg-background rounded-xl border px-6 pt-3 pb-12 shadow-xl">
              <Integration
                icon={<ArrowRight />}
                name="Gemini"
                description="The AI model that powers Google's search engine."
              />
              <Integration
                icon={<ArrowRight />}
                name="Replit"
                description="The AI model that powers Google's search engine."
              />
              <Integration
                icon={<ArrowRight />}
                name="GooglePaLM"
                description="The AI model that powers Google's search engine."
              />
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
            <h2 className="text-3xl font-semibold text-balance md:text-4xl lg:text-5xl">
              Start Tracking Intent Signals
            </h2>
            <p className="text-muted-foreground">Got a deal for ya...</p>

            <Button variant="outline" size="sm" asChild>
              <Link href="#">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const Integration = ({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed py-3 last:border-b-0">
      <div className="bg-muted border-foreground/5 flex size-12 items-center justify-center rounded-lg border">
        {icon}
      </div>
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-muted-foreground line-clamp-1 text-sm">
          {description}
        </p>
      </div>
      <Button variant="outline" size="icon" aria-label="Add integration">
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
