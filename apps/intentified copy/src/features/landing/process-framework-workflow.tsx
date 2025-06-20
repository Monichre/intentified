"use client";
import { FC, useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Eye,
  Search,
  Zap,
  Send,
  Clock,
  Users,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { ProcessStepCard } from "@/components/ui/process-step-card";

const processSteps = [
  {
    id: 1,
    title: "LISTEN",
    subtitle: "Trillions of Signals",
    icon: Eye,
    color: "bg-blue-500",
    description:
      "We monitor 50 billion URLs daily across 270 million US consumers, tracking real-time buying behavior from:",
    features: [
      "Competitor websites",
      "Social media engagement",
      "Search queries",
      "Review sites",
      "Industry publications",
    ],
    metrics: {
      urls: 50,
      consumers: 270,
    },
  },
  {
    id: 2,
    title: "DISCOVER",
    subtitle: "Extreme Precision",
    icon: Search,
    color: "bg-green-500",
    description:
      "Our AI identifies prospects actively researching solutions like yours:",
    features: [
      "Which competitors they're visiting",
      "What products they're comparing",
      "When they're ready to buy",
      "Full contact details (name, email, phone)",
    ],
    metrics: {},
  },
  {
    id: 3,
    title: "CREATE",
    subtitle: "Automated Excellence",
    icon: Zap,
    color: "bg-purple-500",
    description: "Personalized campaigns created in real-time:",
    features: [
      "Dynamic content based on intent signals",
      "Industry-specific messaging",
      "Behavior-triggered sequences",
      "Multi-channel coordination",
    ],
    metrics: {},
  },
  {
    id: 4,
    title: "SEND",
    subtitle: "Speed to Lead",
    icon: Send,
    color: "bg-orange-500",
    description: "Reach prospects while they're still shopping:",
    features: [
      "Near real-time email delivery (5 minutes or less)",
      "8 different ISPs for maximum deliverability",
      "Automated text follow-up for hot leads",
      "Direct appointment scheduling",
    ],
    metrics: {},
  },
];

const timelineSteps = [
  {
    time: "T+0 min",
    action: "Prospect visits competitor site",
    icon: Eye,
    status: "LOG",
    delay: 0,
  },
  {
    time: "T+2 min",
    action: "Identity resolved and qualified",
    icon: Search,
    status: "INFO",
    delay: 2000,
  },
  {
    time: "T+3 min",
    action: "Personalized content created",
    icon: Zap,
    status: "INFO",
    delay: 3000,
  },
  {
    time: "T+5 min",
    action: "Email delivered to inbox",
    icon: Mail,
    status: "INFO",
    delay: 5000,
  },
  {
    time: "T+15 min",
    action: "Follow-up sequence activated",
    icon: MessageSquare,
    status: "LOG",
    delay: 7000,
  },
  {
    time: "T+1 hour",
    action: "SMS outreach (if opted in)",
    icon: Phone,
    status: "LOG",
    delay: 9000,
  },
  {
    time: "T+24 hrs",
    action: "Multi-touch nurture begins",
    icon: Users,
    status: "LOG",
    delay: 11000,
  },
];

export const ProcessFrameworkWorkflow: FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [visibleLogs, setVisibleLogs] = useState<typeof timelineSteps>([]);
  const [isTimelineInView, setIsTimelineInView] = useState(false);

  // Add logs progressively when timeline comes into view
  useEffect(() => {
    if (!isTimelineInView) return;

    const timeouts: NodeJS.Timeout[] = [];

    timelineSteps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, step]);
      }, step.delay);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [isTimelineInView]);

  return (
    <section className="w-full py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center justify-center space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            How We Turn Intent Into Revenue
          </h2>
          <p className="text-muted-foreground max-w-[600px] text-sm md:text-base lg:text-sm xl:text-base">
            Our proven four-step process captures competitor traffic and
            converts it into qualified leads for your business.
          </p>
        </div>

        {/* Four-Step Process Grid */}
        <div className="mb-12 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <ProcessStepCard
              key={step.id}
              step={step}
              isActive={activeStep === step.id}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
            />
          ))}
        </div>

        {/* Speed-to-Lead Timeline */}

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-3 text-sm">
            This entire process happens automatically, in real-time, while your
            prospects are actively shopping.
          </p>
          <Badge className="text-xs font-medium">
            <Clock className="mr-1 h-3 w-3" />
            Average time from visitor to qualified lead: 5 minutes
          </Badge>
        </div>
      </div>
    </section>
  );
};
