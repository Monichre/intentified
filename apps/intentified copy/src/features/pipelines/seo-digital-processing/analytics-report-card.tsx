import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsData } from "@/lib/types";
import { AnalyticsResultItem } from "./analytics-result-item";
import { Globe, Fingerprint } from "lucide-react";

interface AnalyticsReportCardProps {
  data: AnalyticsData;
}

export function AnalyticsReportCard({ data }: AnalyticsReportCardProps) {
  const { websiteUrl, requestId, results, summary } = data;

  return (
    <Card className="my-8 w-full border-slate-200 shadow-xl dark:border-slate-700">
      <CardHeader className="rounded-t-lg border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
        <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Analytics Report
        </CardTitle>
        <div className="text-muted-foreground mt-2 flex flex-col justify-between gap-2 text-sm sm:flex-row sm:gap-4">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>Website: </span>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 truncate text-sky-600 hover:underline dark:text-sky-400"
            >
              {websiteUrl}
            </a>
          </div>
          <div className="flex items-center">
            <Fingerprint className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Request ID: </span>
            <span className="ml-1 font-mono text-xs">{requestId}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="multiple" className="w-full">
          {results.map((result, index) => (
            <AnalyticsResultItem
              key={`${result.type}-${index}`}
              result={result}
            />
          ))}
        </Accordion>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 rounded-b-lg border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          Request Summary
        </h3>
        <div className="grid w-full grid-cols-2 gap-3 text-sm sm:grid-cols-3 md:grid-cols-5">
          <div className="flex flex-col rounded-md bg-white p-3 shadow-sm dark:bg-slate-700">
            <span className="text-muted-foreground">Total Requested:</span>
            <Badge variant="secondary" className="mt-1 self-start">
              {summary.totalRequested}
            </Badge>
          </div>
          <div className="flex flex-col rounded-md bg-white p-3 shadow-sm dark:bg-slate-700">
            <span className="text-muted-foreground">Successful:</span>
            <Badge className="mt-1 self-start bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 dark:hover:bg-green-700">
              {summary.successful}
            </Badge>
          </div>
          <div className="flex flex-col rounded-md bg-white p-3 shadow-sm dark:bg-slate-700">
            <span className="text-muted-foreground">Failed:</span>
            <Badge variant="destructive" className="mt-1 self-start">
              {summary.failed}
            </Badge>
          </div>
          {summary.skipped > 0 && (
            <div className="flex flex-col rounded-md bg-white p-3 shadow-sm dark:bg-slate-700">
              <span className="text-muted-foreground">Skipped:</span>
              <Badge variant="outline" className="mt-1 self-start">
                {summary.skipped}
              </Badge>
            </div>
          )}
          <div className="col-span-2 flex flex-col rounded-md bg-white p-3 shadow-sm sm:col-span-1 md:col-span-1 dark:bg-slate-700">
            <span className="text-muted-foreground">Total Duration:</span>
            <Badge variant="secondary" className="mt-1 self-start">
              {(summary.totalDuration / 1000).toFixed(2)}s
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
