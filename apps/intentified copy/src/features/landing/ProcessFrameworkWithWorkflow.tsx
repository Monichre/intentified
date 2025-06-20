"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/utils/utils";
import AnimatedWorkflowDiagram, {
  WorkflowNode,
  WorkflowConnection,
} from "./AnimatedWorkflowDiagram";
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
import { processSteps } from "@/features/landing/process-steps";

// --- Data Definitions ---

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

const workflowNodes: WorkflowNode[] | any[] = processSteps.map((step) => ({
  ...step,
  id: step.id.toString(),
  type: "input",
  x: step.x,
  y: step.y,
}));

const workflowConnections: WorkflowConnection[] = [
  { from: "1", to: "2", color: "#FFB7C5" },
  { from: "2", to: "3", color: "#FFDDB7" },
  { from: "3", to: "4", color: "#B1C5FF" },
  { from: "4", to: "5", color: "#4FABFF" },
  // { from: "2", to: "7", color: "#076EFF" },
  // { from: "3", to: "7", color: "#FFB7C5" },
  // { from: "4", to: "6", color: "#FFDDB7" },
  // { from: "6", to: "7", color: "#B1C5FF" },
  // { from: "5", to: "7", color: "#4FABFF" },
];

// --- Main Component ---

export const ProcessFrameworkAnimatedWorkflow: React.FC = () => {
  // Animation for workflow paths
  const diagramRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: diagramRef,
    offset: ["start end", "end start"],
  });
  // Animate path lengths for each connection
  const pathLengths = [
    useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
  ];

  // Timeline animation state
  const [visibleLogs, setVisibleLogs] = useState<typeof timelineSteps>([]);
  const [isTimelineInView, setIsTimelineInView] = useState(false);
  useEffect(() => {
    if (!isTimelineInView) return;
    const timeouts: NodeJS.Timeout[] = [];
    timelineSteps.forEach((step) => {
      const timeout = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, step]);
      }, step.delay);
      timeouts.push(timeout);
    });
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isTimelineInView]);

  // --- Render ---
  // container mx-auto
  return (
    <section className="w-full py-12 md:py-24">
      <div className="px-4 md:px-6">
        {/* Animated Workflow Diagram */}

        <div ref={diagramRef} className="mb-20">
          <AnimatedWorkflowDiagram
            nodes={workflowNodes}
            connections={workflowConnections}
            pathLengths={pathLengths}
          />
        </div>

        {/* Call to Action */}
      </div>
    </section>
  );
};
