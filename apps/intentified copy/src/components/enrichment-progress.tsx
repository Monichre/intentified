import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, Activity } from "lucide-react";
import { cn } from "@/utils/utils";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import type {
  EnrichmentProgress,
  MarketingIntelligenceProgress,
} from "@/hooks/use-enrichment-stream";

interface EnrichmentProgressDisplayProps {
  progress: EnrichmentProgress | null;
  marketingProgress: MarketingIntelligenceProgress | null;
  status:
    | "idle"
    | "connecting"
    | "connected"
    | "processing"
    | "completed"
    | "error"
    | "disconnected";
  error: string | null;
  className?: string;
}

export function EnrichmentProgressDisplay({
  progress,
  marketingProgress,
  status,
  error,
  className,
}: EnrichmentProgressDisplayProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "connecting":
      case "connected":
      case "processing":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connecting":
        return "Connecting to enrichment service...";
      case "connected":
        return "Connected, starting analysis...";
      case "processing":
        if (marketingProgress) {
          return marketingProgress.message;
        }
        return progress?.currentType
          ? `Analyzing ${formatEnrichmentType(progress.currentType)}...`
          : "Processing...";
      case "completed":
        return "Analysis complete!";
      case "error":
        return error || "An error occurred";
      default:
        return "Ready to start";
    }
  };

  const formatEnrichmentType = (type: string): string => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const progressPercentage = progress?.percentage || 0;
  const isActive = ["connecting", "connected", "processing"].includes(status);

  return (
    <Card className={cn("space-y-4 p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium text-gray-900">Website Analysis</h3>
            <p className="mt-1 text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
        {progress && (
          <span className="text-sm text-gray-500">
            {progress.currentStep} of {progress.totalSteps} steps
          </span>
        )}
      </div>

      {isActive && (
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />

          {progress && progress.completedTypes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">
                Completed analyses:
              </p>
              <div className="flex flex-wrap gap-2">
                {progress.completedTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {formatEnrichmentType(type)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {marketingProgress && (
            <div className="mt-4 rounded-lg bg-purple-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                <span className="text-sm font-medium text-purple-900">
                  Marketing Intelligence Generation
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-purple-700">
                  {marketingProgress.message}
                </p>
                <Progress
                  value={
                    (marketingProgress.currentStep /
                      marketingProgress.totalSteps) *
                    100
                  }
                  className="h-1.5"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-green-50 p-4"
          >
            <p className="text-sm text-green-800">
              ✨ Website analysis complete! We've gathered comprehensive
              insights about your business.
            </p>
          </motion.div>
        )}

        {status === "error" && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-red-50 p-4"
          >
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Compact version for inline use
export function EnrichmentProgressBadge({
  progress,
  status,
  className,
}: {
  progress: EnrichmentProgress | null;
  status: EnrichmentProgressDisplayProps["status"];
  className?: string;
}) {
  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "error":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        getStatusColor(),
        className,
      )}
    >
      {getIcon()}
      <span>
        {status === "processing" && progress
          ? `${progress.percentage}% Complete`
          : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}
