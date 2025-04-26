// @ts-nocheck
"use client";

/* You might notice this long className everywhere 
shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]

I usually extend my tailwind theme with custom box shadows and I recommend doing the same with a quick find and replace. :)

example tailwind.config.ts:
 
...
extend: {
      boxShadow: {
        "inner-shadow":
          "0px 1px 0px 0px hsla(0, 0%, 0%, 0.02) inset, 0px 0px 0px 1px hsla(0, 0%, 0%, 0.02) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.25)",
        "shadow-border-light":
          "0px 1px 1px 0px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(255, 252, 240, 0.5) inset, 0px 0px 0px 1px hsla(0, 0%, 100%, 0.1) inset, 0px 0px 1px 0px rgba(28, 27, 26, 0.5)",

        "shadow-border-dark":
          "0px 10px 20px rgba(0, 0, 0, 0.6), 0px 6px 12px rgba(0, 0, 0, 0.5), 0px 3px 6px rgba(0, 0, 0, 0.4), 0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(255, 255, 255, 0.06) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.04) inset, 0px -2px 6px rgba(0, 0, 0, 0.25) inset, 0px 1px 1px rgba(255, 255, 255, 0.02), 1px 1px 2px rgba(255, 255, 255, 0.01)",
      },
      ...
*/
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { format } from "date-fns";
import {
  AlertCircle,
  FileText,
  Hash,
  Info,
  SparklesIcon,
  Tag,
  User,
} from "lucide-react";
import type { Database } from "../lib/db/types";
import { cn } from "@/lib/utils";

type Document = Database["public"]["Tables"]["doc_processor_documents"]["Row"];
type ProcessingTask =
  Database["public"]["Tables"]["doc_processor_processing_tasks"]["Row"];
type Chunk =
  Database["public"]["Tables"]["doc_processor_document_chunks"]["Row"];
type Entity =
  Database["public"]["Tables"]["doc_processor_document_entities"]["Row"];
interface DocumentViewerProps {
  document: Document;
  tasks: ProcessingTask[];
  chunks: Chunk[];
  entities: Entity[];
  onRetry?: () => void;
}

export function DocumentViewer({
  document,
  tasks,
  chunks,
  entities,
  onRetry,
}: DocumentViewerProps) {
  return (
    <div className="space-y-6">
      {/* Metadata Panel */}
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pb-2">
          <CardTitle className="flex items-center gap-2 text-xs">
            <div className="bg-muted/5 border-border rounded-lg border p-1">
              <Info className="text-primary size-3" />
            </div>
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 px-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
              File Name
            </div>
            <div className="text-sm font-medium">{document.title}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
              Type
            </div>
            <div className="text-sm font-medium capitalize">
              {document.file_type}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
              Size
            </div>
            <div className="text-sm font-medium">
              {formatFileSize(document.file_size)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
              Upload Date
            </div>
            <div className="text-sm font-medium">
              {format(new Date(document.created_at), "PPP")}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
              Status
            </div>
            <StatusBadge
              className={cn(
                document.status === "processed" &&
                  "rounded-lg border border-green-700/20 bg-green-50 text-green-600",
              )}
              status={document.status}
            />
          </div>
          {document.metadata && (
            <>
              <div className="space-y-1">
                <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
                  Word Count
                </div>
                <div className="text-sm font-medium">
                  {(
                    document.metadata as { wordCount?: number }
                  )?.wordCount?.toLocaleString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground text-xs font-light tracking-wider uppercase">
                  Page Count
                </div>
                <div className="text-sm font-medium">
                  {(document.metadata as { pageCount?: number })?.pageCount}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {document.status === "error" && document.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Processing Failed</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="font-mono text-xs">{document.error}</div>
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                Retry Processing
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Content Tabs */}
      <Tabs
        defaultValue="analysis"
        className="space-y-6 rounded-t-3xl bg-white px-4 pt-4 shadow-inner"
      >
        <TabsList className="bg-secondary ring-offset-muted/60 ring-muted/40 grid grid-cols-4 border-b-[1px] border-b-stone-900/5 shadow-inner ring-[4px] ring-offset-4">
          <TabsTrigger
            value="analysis"
            className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
          >
            <SparklesIcon className="size-3" />
            AI Analysis
          </TabsTrigger>

          <TabsTrigger
            value="chunks"
            className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
          >
            <Hash className="size-3" />
            Chunks
          </TabsTrigger>
          <TabsTrigger
            value="entities"
            className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
          >
            <Tag className="size-3" />
            Entities
          </TabsTrigger>
          <TabsTrigger
            value="original"
            className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
          >
            <FileText className="size-3" />
            Original Text
          </TabsTrigger>
        </TabsList>

        {/* AI Analysis */}
        <TabsContent value="analysis" className="mt-0">
          <Card className="border-none shadow-none">
            <CardContent className="space-y-8 px-0">
              {document.analysis ? (
                <>
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-xs font-semibold">
                      <div className="bg-muted/5 border-border rounded-lg border p-1">
                        <FileText className="text-primary size-3" />
                      </div>
                      Summary
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {(document.analysis as { summary?: string })?.summary}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-xs font-semibold">
                      <div className="bg-muted/5 border-border rounded-lg border p-1">
                        <Tag className="text-primary size-3" />
                      </div>
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(
                        document.analysis as { keywords?: string[] }
                      )?.keywords?.map((keyword) => (
                        <div
                          key={keyword}
                          className="rounded-3xl px-3 py-1 text-xs shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                        >
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  No analysis available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chunks */}
        <TabsContent value="chunks" className="mt-0">
          <Card className="border-none shadow-none">
            <CardContent className="px-0">
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="border-border flex items-center rounded-full border px-2 py-1 font-mono text-xs font-light tracking-tighter">
                      <Hash className="mr-1 h-3 w-3" />
                      {chunks.reduce(
                        (acc, chunk) => acc + chunk.token_count,
                        0,
                      )}{" "}
                      Total Tokens
                    </div>
                    <div className="border-border flex items-center rounded-full border px-2 py-1 font-mono text-xs font-light tracking-tighter">
                      <div className="bg-primary/20 mr-1 h-3 w-3 rounded-full" />
                      {chunks.length} Chunks
                    </div>
                  </div>
                </div>

                {/* Chunks List */}
                <div className="p-4">
                  <div className="grid gap-4">
                    {chunks.map((chunk) => (
                      <div key={chunk.id} className="group relative space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="px-2 text-xs font-light tracking-tighter">
                              Chunk {chunk.chunk_index + 1}
                            </div>
                            {"heading" in chunk &&
                              typeof chunk.heading === "string" && (
                                <Badge variant="secondary" className="px-2">
                                  {chunk.heading}
                                </Badge>
                              )}
                          </div>
                          <div className="text-muted-foreground flex items-center gap-2 text-xs">
                            <div className="px-2 font-mono text-xs font-light tracking-tighter">
                              {chunk.token_count} Tokens
                            </div>
                            {"page_number" in chunk &&
                              typeof chunk.page_number === "number" && (
                                <Badge variant="outline" className="px-2">
                                  Page {chunk.page_number}
                                </Badge>
                              )}
                          </div>
                        </div>

                        <div className="bg-card rounded-lg border p-3 xl:rounded-2xl">
                          <div className="text-muted-foreground text-sm">
                            {chunk.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {chunks.length === 0 && (
                  <div className="text-muted-foreground py-8 text-center">
                    No chunks available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extracted Entities */}
        <TabsContent value="entities" className="mt-0">
          <Card className="border-none shadow-none">
            <CardContent className="px-1">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold">
                  <div className="bg-muted/5 border-border rounded-lg border p-1">
                    <User className="text-primary size-3" />
                  </div>
                  Extracted Entities
                </h3>
                {/* <ScrollArea className="h-[40vh]"> */}
                {/* <div className="grid gap-4  bg-muted/50 rounded-3xl p-3 py-5 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"> */}
                <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
                  {/* Group entities by type */}
                  {Object.entries(
                    entities.reduce(
                      (acc, entity) => {
                        if (!acc[entity.entity_type])
                          acc[entity.entity_type] = [];
                        acc[entity.entity_type].push(entity);
                        return acc;
                      },
                      {} as Record<string, Entity[]>,
                    ),
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([type, entities]) => (
                      <div key={type} className="space-y-4">
                        <div className="flex items-center gap-2 px-2 pb-1">
                          <div className="bg-muted/80 inline-flex items-center gap-1 rounded-sm py-1 pr-1 pl-2 shadow-[0px_1px_0px_0px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_rgba(255,_255,_255,_0.25)]">
                            <h4 className="font-base text-xs tracking-wider">
                              {type}
                            </h4>
                            <Badge
                              variant="outline"
                              className="bg-muted border-none text-xs shadow-[0px_1px_0px_0px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_rgba(255,_255,_255,_0.25)]"
                            >
                              {entities.length}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 px-2">
                          {entities.map((entity) => (
                            <div
                              key={entity.id}
                              className="bg-card flex max-w-xs items-center justify-center rounded-full px-2 py-1.5 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
                            >
                              <span className="text-muted-foreground text-center text-sm">
                                {entity.entity_text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
                {/* </ScrollArea> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Original Text */}
        <TabsContent value="original" className="mt-0">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="bg-muted/50 w-full rounded-2xl border">
                <div className="p-4">
                  <pre className="font-mono text-xs whitespace-pre-wrap">
                    {document.extracted_text}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBadge({
  status,
  className,
}: {
  status: Document["status"];
  className?: string;
}) {
  const variants = {
    pending: "default",
    processing: "secondary",
    completed: "outline",
    processed: "outline",
    error: "destructive",
  } as const;

  return (
    <Badge variant={variants[status]} className={cn("capitalize", className)}>
      {status}
    </Badge>
  );
}

function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
