"use client";

import React, { useRef } from "react";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Users,
  Mail,
  TrendingUp,
  Database,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";

interface Node {
  id: string;
  type: "source" | "process" | "output" | "data";
  title: string;
  value?: string;
  icon?: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
}

const nodes: Node[] = [
  // Source nodes - Competitor websites
  {
    id: "1",
    type: "source",
    title: "Competitor Sites",
    value: "Real-time tracking",
    icon: Eye,
    x: 50,
    y: 100,
  },

  // Process nodes - The 4 steps
  {
    id: "2",
    type: "process",
    title: "Monitor",
    value: "Track visitor behavior",
    icon: Target,
    x: 300,
    y: 100,
  },
  {
    id: "3",
    type: "process",
    title: "Identify",
    value: "Match to 270M database",
    icon: Users,
    x: 550,
    y: 100,
  },
  {
    id: "4",
    type: "process",
    title: "Engage",
    value: "Send personalized emails",
    icon: Mail,
    x: 800,
    y: 100,
  },
  {
    id: "5",
    type: "process",
    title: "Convert",
    value: "Generate qualified leads",
    icon: TrendingUp,
    x: 1050,
    y: 100,
  },

  // Data nodes
  {
    id: "6",
    type: "data",
    title: "Intent Database",
    value: "1.9T+ signals",
    icon: Database,
    x: 425,
    y: 250,
  },
  {
    id: "7",
    type: "data",
    title: "Speed to Lead",
    value: "5 minutes",
    icon: Zap,
    x: 675,
    y: 250,
  },

  // Output node
  {
    id: "8",
    type: "output",
    title: "Your Leads",
    value: "Qualified & ready",
    icon: CheckCircle,
    x: 1300,
    y: 100,
  },
];

const connections = [
  { from: "1", to: "2", color: "#3b82f6" }, // blue
  { from: "2", to: "3", color: "#3b82f6" },
  { from: "3", to: "4", color: "#3b82f6" },
  { from: "4", to: "5", color: "#3b82f6" },
  { from: "5", to: "8", color: "#10b981" }, // green
  { from: "6", to: "3", color: "#8b5cf6" }, // purple
  { from: "7", to: "4", color: "#8b5cf6" },
];

const transition = {
  duration: 0,
  ease: "linear",
};

export function HijackingWorkflowComponent({
  pathLengths,
}: {
  pathLengths: MotionValue[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getNodeById = (id: string) => nodes.find((node) => node.id === id);

  const createPath = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) => {
    const midX = (startX + endX) / 2;
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };

  return (
    <div
      ref={containerRef}
      className="bg-background/50 border-border/50 sticky h-[800px] w-full overflow-x-auto overflow-y-hidden rounded-lg border p-8 backdrop-blur-sm"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(20,1fr)] opacity-5">
        {Array.from({ length: 800 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-gray-500" />
        ))}
      </div>

      {/* Inner scrollable container */}
      <div className="relative h-full min-w-[1400px]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <linearGradient
              id="gradient-blue"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
            </linearGradient>
            <linearGradient
              id="gradient-green"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
            </linearGradient>
            <linearGradient
              id="gradient-purple"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
            </linearGradient>
          </defs>

          {connections.map((connection, index) => {
            const fromNode = getNodeById(connection.from)!;
            const toNode = getNodeById(connection.to)!;
            const path = createPath(
              fromNode.x + 120,
              fromNode.y + 40,
              toNode.x,
              toNode.y + 40,
            );

            const gradientId =
              connection.color === "#3b82f6"
                ? "gradient-blue"
                : connection.color === "#10b981"
                  ? "gradient-green"
                  : "gradient-purple";

            return (
              <motion.path
                key={index}
                d={path}
                stroke={`url(#${gradientId})`}
                style={{
                  pathLength: pathLengths[index],
                }}
                strokeWidth={3}
                fill="none"
                initial={{ pathLength: 0 }}
                transition={transition}
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{ left: node.x, top: node.y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: parseInt(node.id) * 0.1 }}
          >
            <Card
              className={cn(
                "w-[240px] border-2 transition-all duration-300 hover:scale-105",
                node.type === "source" &&
                  "border-blue-500/50 bg-blue-500/10 hover:border-blue-500",
                node.type === "process" &&
                  "bg-primary/10 border-primary/50 hover:border-primary",
                node.type === "output" &&
                  "border-green-500/50 bg-green-500/10 hover:border-green-500",
                node.type === "data" &&
                  "border-purple-500/50 bg-purple-500/10 hover:border-purple-500",
              )}
            >
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-3">
                  {node.icon && (
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        node.type === "source" && "bg-blue-500/20",
                        node.type === "process" && "bg-primary/20",
                        node.type === "output" && "bg-green-500/20",
                        node.type === "data" && "bg-purple-500/20",
                      )}
                    >
                      <node.icon
                        className={cn(
                          "h-5 w-5",
                          node.type === "source" && "text-blue-500",
                          node.type === "process" && "text-primary",
                          node.type === "output" && "text-green-500",
                          node.type === "data" && "text-purple-500",
                        )}
                      />
                    </div>
                  )}
                  <span className="text-sm font-semibold">{node.title}</span>
                </div>
                {node.value && (
                  <p className="text-muted-foreground text-xs">{node.value}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function HijackingSystemWorkflow() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  const pathLengthSecond = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const pathLengthThird = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const pathLengthFourth = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);
  const pathLengthFifth = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const pathLengthSixth = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const pathLengthSeventh = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <div ref={ref} className="w-full">
      <h3 className="mb-2 text-center text-2xl font-bold">How It Works</h3>
      <p className="text-muted-foreground mb-6 text-center text-sm">
        Our automated process captures and converts competitor traffic in
        real-time
      </p>
      <HijackingWorkflowComponent
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
          pathLengthSixth,
          pathLengthSeventh,
        ]}
      />
    </div>
  );
}
