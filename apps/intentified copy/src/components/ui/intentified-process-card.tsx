"use client";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface IntentifiedProcessCardProps {
  item: TimelineItem;
  timelineData: TimelineItem[];
  onToggleItem: (id: number) => void;
}

export default function IntentifiedProcessCard({
  item,
  timelineData,
  onToggleItem,
}: IntentifiedProcessCardProps) {
  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <Card className="absolute top-20 left-1/2 w-64 -translate-x-1/2 overflow-visible border-white/30 bg-black/90 shadow-xl shadow-white/10 backdrop-blur-lg">
      <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-white/50"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
            {item.status === "completed"
              ? "COMPLETE"
              : item.status === "in-progress"
                ? "IN PROGRESS"
                : "PENDING"}
          </Badge>
          <span className="font-mono text-xs text-white/50">{item.date}</span>
        </div>
        <CardTitle className="mt-2 text-sm">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-white/80">
        <p>{item.content}</p>

        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="flex items-center">
              <Zap size={10} className="mr-1" />
              Energy Level
            </span>
            <span className="font-mono">{item.energy}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${item.energy}%` }}
            ></div>
          </div>
        </div>

        {item.relatedIds.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="mb-2 flex items-center">
              <Link size={10} className="mr-1 text-white/70" />
              <h4 className="text-xs font-medium tracking-wider text-white/70 uppercase">
                Connected Nodes
              </h4>
            </div>
            <div className="flex flex-wrap gap-1">
              {item.relatedIds.map((relatedId) => {
                const relatedItem = timelineData.find(
                  (i) => i.id === relatedId,
                );
                return (
                  <Button
                    key={relatedId}
                    variant="outline"
                    size="sm"
                    className="flex h-6 items-center rounded-none border-white/20 bg-transparent px-2 py-0 text-xs text-white/80 transition-all hover:bg-white/10 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleItem(relatedId);
                    }}
                  >
                    {relatedItem?.title}
                    <ArrowRight size={8} className="ml-1 text-white/60" />
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
