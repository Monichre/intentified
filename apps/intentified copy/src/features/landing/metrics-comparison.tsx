"use client";
import { FC, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  Cpu,
  Sparkles,
  TrendingUp,
  Target,
  Database,
  Fingerprint,
  Users,
  ChartBar,
} from "lucide-react";
import { cn } from "@/utils/utils";
import {
  useScrollAnimation,
  useScrollAnimationMultiple,
} from "@/hooks/use-scroll-animation";
import Link from "next/link";
import AccordionFeatures, {
  AccordionFeatureItem,
} from "@/components/ui/accordion-features";
import { GridBackgroundWithBlur } from "@/components/backgrounds/grid-backgrounds/grid-background-with-blur";

// Accordion features data
const accordionItems: AccordionFeatureItem[] = [
  {
    id: "item-1",
    icon: Database,
    title: "Intent Database & Enrichment",
    content:
      "Access 70% of website visitors instantly. Our AI-powered system identifies and enriches visitor data in real-time, turning anonymous traffic into qualified leads with complete contact information and behavioral insights.",
    image: {
      src: "/app-screenshots/dashboard-analytics.png",
      alt: "Intent database visualization",
    },
  },
  {
    id: "item-2",
    icon: Fingerprint,
    title: "Advanced Identity Resolution",
    content:
      "Breakthrough identity matching technology that works across devices and sessions. Know exactly who is visiting your site, what they're looking for, and when they're ready to buy - all while respecting privacy regulations.",
    image: {
      src: "/app-screenshots/identity-resolution.png",
      alt: "Identity resolution interface",
    },
  },
  {
    id: "item-3",
    icon: Users,
    title: "Competitor Visitor Capture",
    content:
      "Capture high-intent visitors who are actively researching your competitors. Our system identifies when prospects are comparing solutions and enables you to reach them at the perfect moment with targeted messaging.",
    image: {
      src: "/app-screenshots/competitor-analysis.png",
      alt: "Competitor analysis dashboard",
    },
  },
  {
    id: "item-4",
    icon: ChartBar,
    title: "Real-Time Analytics & Scoring",
    content:
      "AI-powered lead scoring that updates in real-time based on visitor behavior, engagement patterns, and intent signals. Focus your efforts on the hottest leads while they're still actively shopping.",
    image: {
      src: "/app-screenshots/lead-scoring.png",
      alt: "Analytics and lead scoring dashboard",
    },
  },
];

// Comparison data
const coreFeatures = [
  {
    feature: "Lead Identification",
    traditional: false,
    intentifiedBasic: true,
    intentifiedPro: true,
  },
  {
    feature: "Real-time Intent Signals",
    traditional: false,
    intentifiedBasic: true,
    intentifiedPro: true,
  },
  {
    feature: "Email Campaign Automation",
    traditional: false,
    intentifiedBasic: true,
    intentifiedPro: true,
  },
  {
    feature: "Monthly Email Reach",
    traditional: "10K",
    intentifiedBasic: "50M+",
    intentifiedPro: "150M+",
  },
  {
    feature: "Lead Quality Score",
    traditional: "Basic",
    intentifiedBasic: "Advanced",
    intentifiedPro: "AI-Powered",
  },
  {
    feature: "Support Response",
    traditional: "48-72 hours",
    intentifiedBasic: "24 hours",
    intentifiedPro: "Priority 1hr",
  },
  {
    feature: "Data Ownership",
    traditional: "Platform Only",
    intentifiedBasic: "Full Export",
    intentifiedPro: "Full + API",
  },
];

const advancedFeatures = [
  {
    feature: "Competitor Visitor Capture",
    traditional: false,
    intentifiedBasic: false,
    intentifiedPro: true,
  },
  {
    feature: "Multi-channel Attribution",
    traditional: false,
    intentifiedBasic: true,
    intentifiedPro: true,
  },
  {
    feature: "Custom Intent Scoring",
    traditional: false,
    intentifiedBasic: false,
    intentifiedPro: true,
  },
  {
    feature: "Visitor Journey Mapping",
    traditional: "Limited",
    intentifiedBasic: "Standard",
    intentifiedPro: "Complete",
  },
  {
    feature: "API Access",
    traditional: false,
    intentifiedBasic: "Read-only",
    intentifiedPro: "Full Access",
  },
  {
    feature: "White-label Options",
    traditional: false,
    intentifiedBasic: false,
    intentifiedPro: true,
  },
  {
    feature: "Dedicated Success Manager",
    traditional: false,
    intentifiedBasic: false,
    intentifiedPro: true,
  },
];

export const MetricsComparison: FC = () => {
  // Animation states
  const { elementRef: sectionRef, isInView } = useScrollAnimation({
    threshold: 0.2,
  });
  const { createRef: createMetricRef, visibleElements } =
    useScrollAnimationMultiple({ threshold: 0.3 });
  const { elementRef: tableRef, isInView: tableInView } = useScrollAnimation({
    threshold: 0.1,
  });

  const renderCellValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          style={{ color: "#40e0d0" }}
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (value === false) {
      return <span className="text-zinc-500">—</span>;
    }
    return <span className="text-zinc-200">{value}</span>;
  };

  return (
    <>
      {/* Accordion Features Section */}
      <AccordionFeatures
        heading="The Foundation for Intent-Driven Growth"
        description="Intentified is evolving beyond traditional marketing. Our AI-powered platform transforms anonymous visitors into qualified leads, helping businesses capture demand when it matters most."
        items={accordionItems}
        defaultActiveItem="item-1"
      />

      {/* Metrics Section */}
      <section
        ref={sectionRef as any}
        className={cn(
          "w-full py-12 transition-all duration-1000 md:py-24 lg:py-32",
          isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2
              className={cn(
                "text-3xl font-bold tracking-tighter text-white transition-all delay-200 duration-700 sm:text-4xl md:text-5xl",
                isInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
            >
              Proven Results That Drive Revenue
            </h2>
            <p
              className={cn(
                "max-w-[700px] text-zinc-300 transition-all delay-400 duration-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed",
                isInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
            >
              See how Intentified outperforms traditional marketing across every
              metric that matters to your bottom line.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Metric 1: Conversion Rate */}
            <Card
              ref={createMetricRef(0) as any}
              className={cn(
                "hover:border-primary/30 border-zinc-700 bg-black/70 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-lg",
                visibleElements.has(0)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
              style={{
                transitionDelay: visibleElements.has(0) ? "0ms" : "0ms",
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-end text-4xl font-bold text-white">
                  <AnimatedNumber
                    value={visibleElements.has(0) ? 5 : 0}
                    duration={1500}
                    className="text-primary"
                  />
                  <span className="mx-1">-</span>
                  <AnimatedNumber
                    value={visibleElements.has(0) ? 10 : 0}
                    duration={1500}
                    className="text-primary"
                  />
                  <span>X</span>
                </CardTitle>
                <CardDescription className="text-lg font-medium text-zinc-200">
                  Higher Conversion Rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 italic">
                  vs. traditional PPC
                </p>
              </CardContent>
            </Card>

            {/* Metric 2: Cost Per Lead */}
            <Card
              ref={createMetricRef(1) as any}
              className={cn(
                "hover:border-primary/30 border-zinc-700 bg-black/70 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-lg",
                visibleElements.has(1)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
              style={{
                transitionDelay: visibleElements.has(1) ? "200ms" : "0ms",
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-4xl font-bold text-white">
                  <AnimatedNumber
                    value={visibleElements.has(1) ? 80 : 0}
                    duration={1500}
                    className="text-primary"
                  />
                  <span>%</span>
                </CardTitle>
                <CardDescription className="text-lg font-medium text-zinc-200">
                  Lower Cost Per Lead
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 italic">
                  $10-$50 vs. $250+ on paid ads
                </p>
              </CardContent>
            </Card>

            {/* Metric 3: Visitor Identity Match */}
            <Card
              ref={createMetricRef(2) as any}
              className={cn(
                "hover:border-primary/30 border-zinc-700 bg-black/70 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-lg",
                visibleElements.has(2)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
              style={{
                transitionDelay: visibleElements.has(2) ? "400ms" : "0ms",
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-4xl font-bold text-white">
                  <AnimatedNumber
                    value={visibleElements.has(2) ? 60 : 0}
                    duration={1500}
                    className="text-primary"
                  />
                  <span className="mx-1">-</span>
                  <AnimatedNumber
                    value={visibleElements.has(2) ? 70 : 0}
                    duration={1500}
                    className="text-primary"
                  />
                  <span>%</span>
                </CardTitle>
                <CardDescription className="text-lg font-medium text-zinc-200">
                  Visitor Identity Match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 italic">
                  Know exactly who's shopping
                </p>
              </CardContent>
            </Card>

            {/* Metric 4: Monthly Email Reach */}
            <Card
              ref={createMetricRef(3) as any}
              className={cn(
                "hover:border-primary/30 border-zinc-700 bg-black/70 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:shadow-lg",
                visibleElements.has(3)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0",
              )}
              style={{
                transitionDelay: visibleElements.has(3) ? "600ms" : "0ms",
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-4xl font-bold text-white">
                  <AnimatedNumber
                    value={visibleElements.has(3) ? 150 : 0}
                    duration={1500}
                    className="text-primary"
                  />
                  <span>M+</span>
                </CardTitle>
                <CardDescription className="text-lg font-medium text-zinc-200">
                  Monthly Email Reach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400 italic">
                  Across 8 sending platforms
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Table */}
          <div
            ref={tableRef as any}
            className={cn(
              "mt-24 mb-12 transition-all delay-300 duration-1000",
              tableInView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0",
            )}
          >
            <h3 className="mb-8 text-center text-2xl font-bold text-white">
              Choose Your Growth Path
            </h3>
            <div className="mx-auto max-w-5xl">
              <div className="w-full overflow-auto lg:overflow-visible">
                <table className="w-[200vw] border-separate border-spacing-x-3 md:w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="*:py-4 *:text-left *:font-medium">
                      <th className="lg:w-2/5"></th>
                      <th className="space-y-3">
                        <span className="block text-white">
                          Traditional Marketing
                        </span>
                        <span className="block text-sm font-normal text-zinc-400">
                          PPC, Paid Ads, Cold Outreach
                        </span>
                      </th>
                      <th className="space-y-3 rounded-t-lg bg-zinc-800 px-4">
                        <span className="block text-white">
                          Intentified Starter
                        </span>
                        <Button asChild size="sm">
                          <Link href="/sign-up">Get Started</Link>
                        </Button>
                      </th>
                      <th className="space-y-3">
                        <span className="block text-white">
                          Intentified Pro
                        </span>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/sign-up">Contact Sales</Link>
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-caption text-sm">
                    {/* Core Features Section */}
                    <tr className="*:py-3">
                      <td className="flex items-center gap-2 font-medium text-white">
                        <Target className="size-4" />
                        <span>Core Features</span>
                      </td>
                      <td></td>
                      <td className="border-none bg-zinc-800 px-4"></td>
                      <td></td>
                    </tr>
                    {coreFeatures.map((row, index) => (
                      <tr
                        key={index}
                        className="*:border-b *:border-zinc-700 *:py-3"
                      >
                        <td className="text-zinc-300">{row.feature}</td>
                        <td className="text-zinc-300">
                          {renderCellValue(row.traditional)}
                        </td>
                        <td className="border-none bg-zinc-800 px-4">
                          <div className="-mb-3 border-b border-zinc-700 py-3 text-zinc-300">
                            {renderCellValue(row.intentifiedBasic)}
                          </div>
                        </td>
                        <td className="text-zinc-300">
                          {renderCellValue(row.intentifiedPro)}
                        </td>
                      </tr>
                    ))}

                    {/* Advanced Features Section */}
                    <tr className="*:pt-8 *:pb-3">
                      <td className="flex items-center gap-2 font-medium text-white">
                        <TrendingUp className="size-4" />
                        <span>Advanced Features</span>
                      </td>
                      <td></td>
                      <td className="border-none bg-zinc-800 px-4"></td>
                      <td></td>
                    </tr>
                    {advancedFeatures.map((row, index) => (
                      <tr
                        key={index}
                        className="*:border-b *:border-zinc-700 *:py-3"
                      >
                        <td className="text-zinc-300">{row.feature}</td>
                        <td className="text-zinc-300">
                          {renderCellValue(row.traditional)}
                        </td>
                        <td className="border-none bg-zinc-800 px-4">
                          <div className="-mb-3 border-b border-zinc-700 py-3 text-zinc-300">
                            {renderCellValue(row.intentifiedBasic)}
                          </div>
                        </td>
                        <td className="text-zinc-300">
                          {renderCellValue(row.intentifiedPro)}
                        </td>
                      </tr>
                    ))}
                    <tr className="*:py-6">
                      <td></td>
                      <td></td>
                      <td className="rounded-b-lg border-none bg-zinc-800 px-4"></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MetricsComparison;
