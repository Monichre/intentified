"use client";

// External imports
import {
  BarChart3,
  Target,
  BarChart,
  Zap,
  UserCheck,
  Users2,
  LayoutDashboard,
  LineChart,
  TrendingUp,
  Users,
} from "lucide-react";

// Internal imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DotPattern } from "@/components/dot-pattern";
import { IntentSequenceMultipleInputs } from "@/components/intent-sequence-animated-beam/IntentSequenceMultipleInputs";
import { cn } from "@/lib/utils";

/**
 * SectionTitle component for consistent headings across sections
 */
const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="text-3xl font-bold tracking-tight uppercase sm:text-4xl">
        <span className="relative">
          {title.split(" ").map((word, idx) => (
            <span
              key={`word-${idx}`}
              className={idx === 1 ? "text-primary" : ""}
            >
              {word}{" "}
            </span>
          ))}
        </span>
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl text-center text-lg">
        {subtitle}
      </p>
    </div>
  );
};

/**
 * FeatureCard component displaying individual feature with icon and description
 */
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  return (
    <Card
      key={index}
      className="border-border/50 bg-background/60 hover:border-primary/20 group overflow-hidden rounded-xl border p-1 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative p-5">
        <div
          className="group-hover:bg-opacity-80 mb-3 flex h-14 w-14 items-center justify-center rounded-lg transition-all duration-300"
          style={{
            backgroundColor: feature.bgColor,
            color: feature.textColor,
          }}
        >
          {feature.icon}
        </div>
        <CardTitle className="mb-1 text-xl font-semibold tracking-tight">
          {feature.title}
        </CardTitle>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </Card>
  );
};

/**
 * Features data array containing all product features with their details
 */
const features = [
  {
    title: "Intent Identification",
    description:
      "Real-Time Signals: Capture active buying signals across billions of data points. Competitor Insights: Borrow leads directly from competitors and dominate your niche.",
    icon: <Target className="h-7 w-7" aria-hidden="true" />,
    bgColor: "rgba(59, 130, 246, 0.1)",
    textColor: "rgb(59, 130, 246)",
  },
  {
    title: "Precision Analytics",
    description:
      "AI-driven Insights: Turn anonymous visitors into actionable leads. Intent Dashboard: Clear visuals that highlight critical insights instantly.",
    icon: <BarChart className="h-7 w-7" aria-hidden="true" />,
    bgColor: "rgba(234, 179, 8, 0.1)",
    textColor: "rgb(234, 179, 8)",
  },
  {
    title: "Seamless Integrations",
    description:
      "Connect effortlessly with your existing CRM, marketing, and sales platforms. Automate workflows without writing a single line of code.",
    icon: <Zap className="h-7 w-7" aria-hidden="true" />,
    bgColor: "rgba(168, 85, 247, 0.1)",
    textColor: "rgb(168, 85, 247)",
  },
  {
    title: "Built for Growth",
    description: "Accelerate revenue with precision-driven intent data.",
    icon: <BarChart3 className="h-7 w-7" aria-hidden="true" />,
    bgColor: "rgba(34, 197, 94, 0.1)",
    textColor: "rgb(34, 197, 94)",
  },
  {
    title: "Speed of Implementation",
    description:
      "Deploy in minutes, not months, to start capturing opportunities immediately.",
    icon: <Zap className="h-7 w-7" aria-hidden="true" />,
    bgColor: "rgba(249, 115, 22, 0.1)",
    textColor: "rgb(249, 115, 22)",
  },
  {
    title: "ROI Guaranteed",
    description:
      "Stop guessing—focus on leads that convert and maximize your marketing spend.",
    icon: <LayoutDashboard className="h-7 w-7" aria-hidden="true" />,
    bgColor: "rgba(14, 165, 233, 0.1)",
    textColor: "rgb(14, 165, 233)",
  },
];

/**
 * Main Features component
 */
export function Features() {
  return (
    <section
      id="features"
      className="relative"
      aria-labelledby="features-heading"
    >
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50"
        aria-hidden="true"
      />
      <div
        className="absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <SectionTitle
          title="Packed with Cutting-Edge Features"
          subtitle="Intentified identifies your prospects' real-time interests so you can deliver exactly what they're searching for."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={`feature-${i}`} feature={feature} index={i} />
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Feature highlight */}
          <div className="border-border/50 bg-background/50 mt-24 rounded-xl border p-8 lg:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
              <div
                className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-lg md:h-24 md:w-24"
                aria-hidden="true"
              >
                <Zap className="text-primary h-10 w-10 md:h-12 md:w-12" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold tracking-tight">
                  POWERED BY BILLIONS OF INTENT SIGNALS
                </h3>
                <p className="text-muted-foreground mt-4 text-lg">
                  Reveal hidden opportunities in your marketing funnel: Website
                  Intent → Social Signals → Keyword Analysis
                </p>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full"
                      aria-hidden="true"
                    >
                      <Target className="text-primary h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">
                      Real-time tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full"
                      aria-hidden="true"
                    >
                      <BarChart className="text-primary h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">
                      Actionable insights
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full"
                      aria-hidden="true"
                    >
                      <Zap className="text-primary h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium">
                      Revenue acceleration
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="relative mx-auto my-32 sm:my-40">
            <IntentSequenceMultipleInputs />
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
              )}
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}
