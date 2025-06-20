import React, { useRef } from "react";
import { MotionValue, motion, useScroll } from "framer-motion";
import { cn } from "@/utils/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackgroundDots } from "@/components/background";
import { Badge } from "@/components/ui/badge";
import { Folder, Users } from "lucide-react";
import { ProcessFlowInteractive } from "@/features/landing/process-flow-interactive";
import { LayeredDataCard } from "@/components/layered-data-card";

export interface WorkflowNode {
  id: string;
  type: "logic" | "input" | "output" | "request";
  title: string;
  value?: string;
  x: number;
  y: number;
}

export interface WorkflowConnection {
  from: string;
  to: string;
  color: string;
}

interface AnimatedWorkflowDiagramProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  pathLengths: MotionValue[];
  className?: string;
}

// DetailsCardProps interface for type safety
export interface DetailsCardProps {
  title: string;
  subtitle: string;
  description: string;
  details: Array<{ icon: React.ElementType | null; text: string }>;
  features: string[];
}

const DetailsCard = ({
  title,
  subtitle,
  description,
  details,

  features,
}: DetailsCardProps) => {
  return (
    <Card
      className={cn(
        "h-[250px] w-[300px] cursor-pointer transition-all duration-300 hover:scale-105",
        "ring-primary !p-3 shadow-lg ring-2",
      )}
    >
      <CardHeader className="w-full">
        <CardTitle className="text-left text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-left font-medium text-black">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-1 !text-black">
        {/* <p className="text-sm text-black">{description}</p> */}

        <ul className="mx-auto space-y-2">
          {features
            ? features?.map((feature, idx) => (
                <li key={idx} className="flex items-center text-xs text-black">
                  <div className="bg-primary mr-2 h-1 w-1 rounded-full" />
                  {feature}
                </li>
              ))
            : details
              ? details?.map((detail, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground flex items-center text-xs"
                  >
                    {detail.text}
                  </li>
                ))
              : null}
        </ul>
      </CardContent>
    </Card>
  );
};

export const AnimatedWorkflowDiagram: React.FC<
  AnimatedWorkflowDiagramProps
> = ({ nodes, connections, pathLengths, className }) => {
  console.log("🚀 ~ connections:", connections);

  console.log("🚀 ~ nodes:", nodes);

  const containerRef = useRef<HTMLDivElement>(null);
  // Accessibility: aria-label for diagram
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
      className={cn(
        "relative flex h-[800px] w-full items-center justify-center overflow-x-auto p-4",
        className,
      )}
      aria-label="Workflow diagram"
      role="img"
    >
      <BackgroundDots
        dotSize={1.2}
        dotColor={
          typeof document !== "undefined" &&
          document.documentElement.classList.contains("dark")
            ? "#fff"
            : "#000"
        }
        // backgroundColor={
        //   typeof window !== "undefined" &&
        //   window.matchMedia &&
        //   window.matchMedia("(prefers-color-scheme: dark)").matches
        //     ? "#000"
        //     : "#fff"
        // }
        gap={12}
        className="bg-white dark:bg-black"
      />
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        aria-hidden="true"
      >
        {connections.map((connection, index) => {
          const fromNode = getNodeById(connection.from)!;

          const toNode = getNodeById(connection.to)!;
          const path = createPath(
            fromNode.x + 100,
            fromNode.y + 30,
            toNode.x,
            toNode.y + 30,
          );
          return (
            <motion.path
              key={index}
              d={path}
              stroke={connection.color}
              style={{ pathLength: pathLengths[index] }}
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: 0 }}
              transition={{ duration: 0, ease: "linear" }}
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
          transition={{
            duration: 0.3,
            delay: Number.parseInt(node.id.split("-")[1]) * 0.05,
          }}
          tabIndex={0}
          aria-label={`${node.title}${node.value ? ": " + node.value : ""}`}
        >
          {/* <DetailsCard {...node} /> */}
          <LayeredDataCard value={node.value} {...node} />
          {/* <Card
                className={cn(
                  "w-[200px] bg-black border-neutral-800 transition-all duration-200 !px-2 py-2",
                  "ring-2 ring-black",
                 "border-blue-900/50",
              
                    
                )}
              >
                <h4 className="text-sm font-medium text-white">{node.title}</h4>
                <CardContent className="w-full h-full flex flex-col justify-start items-center !px-0">
                                   
                <p className="text-xs text-white">
                        {node.subtitle}
                      </p>
                  
                  

                  

                  {node.value && <p className="text-xs text-white break-all">{node.value}</p>}
               
                    <span className="text-sm text-white font-mono">{node.icon && <node.icon className="w-4 h-4" />}</span>


                </CardContent>
              </Card> */}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedWorkflowDiagram;
