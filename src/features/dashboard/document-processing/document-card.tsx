// @ts-nocheck

"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, AlertCircle, Loader2, X } from "lucide-react";

import {
  Drawer,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

import { DocumentViewer } from "./document";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PdfFileIcon } from "./upload-zone";
import { Doc01Icon } from "./upload-zone";
import { Txt01Icon } from "./upload-zone";
import React from "react";
import { cn } from "@/lib/utils";

type Document = any["public"]["Tables"]["doc_processor_documents"]["Row"];
type ProcessingTask =
  any["public"]["Tables"]["doc_processor_processing_tasks"]["Row"];
type Chunk = any["public"]["Tables"]["doc_processor_document_chunks"]["Row"];
type Entity = any["public"]["Tables"]["doc_processor_document_entities"]["Row"];
interface DocumentCardProps {
  document: Document;
  tasks: ProcessingTask[];
  chunks: Chunk[];
  entities: Entity[];
}

const FILE_ICON_MAP = {
  pdf: { Icon: PdfFileIcon, bgColor: "bg-red-500/5", color: "text-red-500/90" },
  docx: {
    Icon: Doc01Icon,
    bgColor: "bg-green-500/5",
    color: "text-green-500/90",
  },
  txt: { Icon: Txt01Icon, bgColor: "bg-blue-500/5", color: "text-blue-500/90" },
} as const;

export function DocumentCard({
  document,
  tasks,
  chunks,
  entities,
}: DocumentCardProps) {
  const router = useRouter();

  const getDocumentProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(
      (task) => task.status === "processed",
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getLatestTask = () => {
    return tasks.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
  };

  const progress = getDocumentProgress();
  const latestTask = getLatestTask();
  const isProcessing = document.status === "processing";
  const isError = document.status === "error";

  const fileTypeConfig = FILE_ICON_MAP[document.file_type] || FILE_ICON_MAP.txt;

  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>
        <div
          className="group hover:bg-accent/50 relative cursor-pointer overflow-hidden rounded-3xl p-4 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)] transition-colors"
          onClick={() => router.push(`?documentId=${document.id}`)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "text-primary rounded-xl p-2",
                  "shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]",
                  fileTypeConfig.bgColor,
                )}
              >
                {React.createElement(fileTypeConfig.Icon, {
                  className: cn(
                    "size-7 transition-transform duration-200",
                    fileTypeConfig.color,
                    "drop-shadow-sm hover:drop-shadow-md",
                  ),
                })}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="leading-none font-medium">{document.title}</h3>
                  <Badge
                    variant={
                      document.status === "processed" ? "outline" : "secondary"
                    }
                    className="font-normal"
                  >
                    {document.status}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-sm">
                  Uploaded{" "}
                  {formatDistanceToNow(new Date(document.created_at), {
                    addSuffix: true,
                  })}
                </div>
                {isProcessing && latestTask && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="capitalize">
                      {latestTask.task_type}...
                    </span>
                  </div>
                )}
                {isError && document.error && (
                  <div className="text-destructive flex items-center gap-2 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {document.error}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {isProcessing && (
            <Progress
              value={progress}
              className="bg-muted/50 absolute right-0 bottom-0 left-0 h-1 rounded-none"
            />
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="relative container mx-auto flex h-[calc(100vh-10rem)] max-w-4xl flex-col py-4">
          <DrawerHeader className="bg-secondary/50 flex-none rounded-[1.05rem] px-1 py-1 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "text-primary rounded-l-[0.8rem] rounded-r-sm p-2",
                    "shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]",
                    fileTypeConfig.bgColor,
                  )}
                >
                  {React.createElement(fileTypeConfig.Icon, {
                    className: cn(
                      "size-5 transition-transform duration-200",
                      fileTypeConfig.color,
                      "drop-shadow-sm hover:drop-shadow-md ml-1",
                    ),
                  })}
                </div>
                <DrawerTitle className="text-sm tracking-tighter md:text-base lg:font-light">
                  {document.title}
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-primary rounded-l-sm rounded-r-[0.8rem] p-2",
                    "shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]",
                  )}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <ScrollArea className="-mx-1 flex-1 px-4 pl-3">
            <div className="py-2">
              <DocumentViewer
                document={document}
                tasks={tasks}
                chunks={chunks}
                entities={entities}
              />
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
