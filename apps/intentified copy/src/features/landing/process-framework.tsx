"use client";

import { FC, useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
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
import { cn } from "@/utils/utils";
import { processSteps } from "@/features/landing/process-steps";

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

export const ProcessFramework: FC = () => {
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
    <section className="bg-muted/30 w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How We Turn Intent Into Revenue
          </h2>
          <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our proven four-step process captures competitor traffic and
            converts it into qualified leads for your business.
          </p>
        </div>

        {/* Four-Step Process Grid */}
        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = activeStep === step.id;

            return (
              <Card
                key={step.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105",
                  isActive
                    ? "ring-primary shadow-lg ring-2"
                    : "hover:shadow-md",
                )}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-center space-x-3">
                    <div
                      className={cn("rounded-full p-2 text-white", step.color)}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {step.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-foreground text-base font-medium">
                    {step.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>

                  {/* Metrics for Step 1 */}
                  {step.id === 1 && (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <div className="bg-primary/5 rounded p-2 text-center">
                        <div className="text-primary text-lg font-bold">
                          <AnimatedNumber value={step.metrics.urls} />B
                        </div>
                        <div className="text-muted-foreground text-xs">
                          URLs Daily
                        </div>
                      </div>
                      <div className="bg-primary/5 rounded p-2 text-center">
                        <div className="text-primary text-lg font-bold">
                          <AnimatedNumber value={step.metrics.consumers} />M
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Consumers
                        </div>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-1">
                    {step.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-muted-foreground flex items-center text-xs"
                      >
                        <div className="bg-primary mr-2 h-1 w-1 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Speed-to-Lead Timeline */}
        <div className="mt-20">
          <h3 className="mb-8 text-center text-2xl font-bold">
            Speed-to-Lead Timeline
          </h3>

          <motion.div
            className="relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-800 bg-black"
            onViewportEnter={() => setIsTimelineInView(true)}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute right-0 bottom-0 left-0 z-10 h-[100px] w-full bg-gradient-to-t from-black to-transparent" />
            <div className="absolute inset-0 w-full overflow-y-auto p-4">
              <motion.div
                transition={{
                  delay: -0.2,
                  duration: 0.1,
                  staggerChildren: 0.1,
                }}
                layout
                className="relative flex w-full flex-col"
              >
                {visibleLogs.map((step, index) => {
                  const IconComponent = step.icon;
                  const resolveLogColor = {
                    LOG: "#a3e635", // Lime green (brand yellow/green)
                    INFO: "#3b82f6", // Blue
                    ERROR: "#ef4444", // Red
                  };

                  return (
                    <motion.div
                      key={index}
                      layout={true}
                      initial={{
                        opacity: 0,
                        y: -20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-4 border-b border-gray-800 py-3 font-mono text-sm text-white"
                    >
                      <div className="w-20 flex-shrink-0 text-right text-gray-400">
                        {step.time}
                      </div>
                      <div
                        className="flex w-[60px] flex-shrink-0 gap-1 font-bold"
                        style={{
                          color:
                            resolveLogColor[
                              step.status as keyof typeof resolveLogColor
                            ],
                        }}
                      >
                        [{step.status}]
                      </div>
                      <div className="flex flex-1 items-center gap-2">
                        <IconComponent className="h-4 w-4 text-lime-400" />
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {step.action}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Blinking cursor after last entry */}
                {visibleLogs.length === timelineSteps.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-4 py-3"
                  >
                    <div className="w-20 flex-shrink-0 text-right" />
                    <div className="w-[60px] flex-shrink-0" />
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="text-lime-400"
                    >
                      ▊
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            This entire process happens automatically, in real-time, while your
            prospects are actively shopping.
          </p>
          <Badge className="text-sm font-medium">
            <Clock className="mr-1 h-4 w-4" />
            Average time from visitor to qualified lead: 5 minutes
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default ProcessFramework;
