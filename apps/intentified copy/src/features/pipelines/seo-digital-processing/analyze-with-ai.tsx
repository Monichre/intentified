"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Globe, Zap, Hash, Info, StarsIcon } from "lucide-react"; // Importing some icons from lucide-react for demonstration

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";

import { SEODiff, improveSEOAction } from "./lib/actions";

import { cn } from "@/utils/utils";

import { toast } from "sonner";
import { LoadingButton } from "@repo/design-system/components/ui/button";

interface Props {
  seoData: any;
}

const buttonCopy = {
  idle: "Analyze with AI",
  loading: "Loading...",
  success: "Success!",
  error: "Must use valid URL!",
} as const;

export function AnalyzeWithAISection({ seoData }: Props) {
  const [generation, setGeneration] = useState<SEODiff | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setStatus("loading");
    setError(null);
    try {
      const { originalData, improvedData } = await improveSEOAction(seoData);
      setGeneration({ originalData, improvedData });
    } catch (err) {
      setError("An error occurred while improving SEO. Please try again.");
      setStatus("error");
    } finally {
      setStatus("success");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-2">
      <Card className="bg-base-900 shadow-inner-shadow relative w-full overflow-hidden px-6 py-6 shadow-lg lg:min-w-[200px]">
        {!generation ? (
          <CardHeader className="flex items-center justify-between px-6 pt-3 pb-0">
            <CardTitle className="text-base-200 text-lg leading-6 font-medium">
              <StarsIcon className="fill-cyan-light/40 stroke-cyan-light stroke-1" />
            </CardTitle>
            <LoadingButton
              buttonCopy={buttonCopy}
              status={status}
              className="from-cyan-light to-cyan bg-gradient-to-b"
              onClick={handleClick}
              title="Improve SEO"
            />
          </CardHeader>
        ) : null}

        <CardContent className="px-2">
          {generation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SEODataCard
                originalData={generation.originalData}
                improvedData={generation.improvedData}
              >
                {status === "loading" && (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Skeleton className="mb-2 h-6" />
                    <Skeleton className="mb-2 h-6" />
                    <Skeleton className="mb-2 h-6" />
                    <Skeleton className="mb-2 h-6" />
                    <Skeleton className="mb-2 h-6" />
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-red-500">{error}</p>
                    <Button onClick={handleClick}>Retry</Button>
                  </motion.div>
                )}
              </SEODataCard>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const SEODataCard: React.FC<SEODiff> = ({
  originalData,
  improvedData,
  children,
}) => {
  const hasChanges = (original: string, improved: string) =>
    original !== improved && improved?.length >= 1;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Text copied to clipboard");
      },
      (err) => {
        toast.error("Could not copy text: ", err);
      },
    );
  };

  const renderMetaInformation = () => (
    <section className="from-base-950 via-base-875 to-base-975 shadow-inner-shadow rounded-lg bg-gradient-to-t px-2 py-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {hasChanges(originalData.title, improvedData.title) && (
          <motion.div
            className="shadow-inner-shadow bg-base-900 w-full cursor-pointer rounded-[9px] px-px pb-px"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => copyToClipboard(improvedData.title)}
          >
            <CardHeader className="flex flex-row items-center justify-end pt-3 pb-0">
              <span className="mt-1">{getIcon("title")}</span>
              <CardTitle className="ml-2">Title</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-base-200 mt-auto flex flex-col pr-2">
                <span className="text-base-300/80 w-8 rounded-t-sm px-0.5 py-0.5 text-center text-[10px]">
                  Old
                </span>
                <div className="bg-base-800 border-base-100/20 flex flex-wrap gap-1 rounded-lg border border-dashed px-2 py-2 pr-3 text-xs">
                  {originalData.title}
                </div>
              </div>

              <div className="text-base-200 flex flex-col pr-2">
                <span className="text-green-light w-8 rounded-t-sm bg-black/40 px-0.5 py-0.5 text-center text-[10px]">
                  New
                </span>
                <div className="flex flex-wrap gap-1 rounded-r-lg rounded-b-lg bg-black/40 px-2 py-2 pr-3 text-sm">
                  {improvedData.title}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}

        {hasChanges(originalData.keywords, improvedData.keywords) && (
          <motion.div
            className="shadow-inner-shadow bg-base-900 w-full cursor-pointer rounded-[9px] px-px pb-px"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => copyToClipboard(improvedData.keywords)}
          >
            <CardHeader className="flex flex-row items-center justify-end pt-3 pb-0">
              <span className="mt-1">{getIcon("keywords")}</span>
              <CardTitle className="ml-2">Keywords</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-2 pr-1 pb-1 pl-3">
              <div className="text-base-200 flex flex-col gap-1 pr-2">
                <span className="text-base-300/80 w-8 px-0.5 py-0.5 text-[10px]">
                  Old
                </span>
                <div className="flex flex-wrap gap-0.5 pr-3 text-sm">
                  {originalData.keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-base-800 border-base-100/20 rounded-md border border-dashed px-1 py-0.5 text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-base-200 flex flex-col pr-2">
                <span className="text-green-light w-8 rounded-t-sm bg-black/40 px-0.5 py-0.5 text-center text-[10px]">
                  New
                </span>
                <div className="flex flex-wrap gap-1 rounded-r-lg rounded-b-lg bg-black/40 px-2 py-2 pr-3 text-sm">
                  {improvedData.keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-base-700/40 rounded-md px-2 py-1"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}

        {hasChanges(
          originalData.metaDescription,
          improvedData.metaDescription,
        ) && (
          <motion.div
            className={cn(
              "shadow-inner-shadow bg-base-900 w-full cursor-pointer rounded-[9px] px-px pb-px",
              hasChanges(originalData.title, improvedData.title) &&
                hasChanges(originalData.keywords, improvedData.keywords)
                ? "md:col-span-2"
                : "col-span-1",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => copyToClipboard(improvedData.metaDescription)}
          >
            <CardHeader className="flex items-center pt-4 pb-0">
              {getIcon("metaDescription")}
              <CardTitle className="ml-2">Meta Description</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col justify-center gap-2 pr-1 pb-2 pl-3">
              <div className="text-base-200 flex flex-col gap-1 pr-2">
                <span className="text-base-300/80 w-8 px-0.5 py-0.5 text-[10px]">
                  Old
                </span>
                <div className="bg-base-800 border-base-100/20 flex flex-wrap gap-1 rounded-lg border border-dashed px-2 py-1 pr-3 text-sm">
                  {originalData.metaDescription}
                </div>
              </div>

              <div className="text-base-200 flex flex-col gap-0 pr-2">
                <span className="text-green-light w-8 rounded-t-sm bg-black/40 px-0.5 py-0.5 text-center text-[10px]">
                  New
                </span>
                <div className="flex flex-wrap gap-1 rounded-r-lg rounded-b-lg bg-black/40 px-2 py-1 pr-3 text-sm">
                  {improvedData.metaDescription}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </div>
    </section>
  );

  const renderHeadings = () => (
    <section className="from-base-975 via-base-950 to-base-975 shadow-inner-shadow rounded-lg bg-gradient-to-t px-2 py-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(originalData.headings).map(([tag, originalHeadings]) =>
          originalHeadings.map((heading, index) => {
            const headingsForTag = improvedData.headings[tag];
            const improvedHeading = headingsForTag
              ? headingsForTag[index]
              : undefined;

            return (
              headingsForTag &&
              improvedHeading !== undefined &&
              hasChanges(heading, improvedHeading) && (
                <motion.div
                  key={`${tag}-${index}`}
                  className="shadow-inner-shadow bg-base-900 cursor-pointer rounded-[9px] px-px pb-px"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => copyToClipboard(improvedHeading)}
                >
                  <div className="relative flex h-full items-center gap-3">
                    <CardHeader className="absolute top-0 right-2 py-2 pr-1 pl-3">
                      <div className="text-base-500 flex items-start justify-center">
                        <Hash className="mt-0.5 h-4 w-4" />
                        <CardTitle className="ml-1 text-sm">
                          {tag.toUpperCase()}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center py-2 pr-2 pl-2">
                      <div className="text-base-500 flex flex-col pr-2">
                        <span className="text-base-300/80 w-8 px-0.5 py-0.5 text-xs">
                          Old
                        </span>
                        <span className="text-xs leading-5 md:pr-9">
                          {heading}
                        </span>
                      </div>
                      <div className="text-base-200 mt-2 flex flex-col text-sm">
                        <span className="text-green-light w-8 rounded-sm bg-black/40 px-0.5 py-0.5 text-center text-xs">
                          New
                        </span>
                        <p className="overflow-hidden rounded-r-lg rounded-b-lg bg-black/40 px-2 py-1 text-xs leading-5">
                          {improvedHeading}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </motion.div>
              )
            );
          }),
        )}
      </div>
    </section>
  );

  return (
    <div className="w-full overflow-hidden rounded-[10px]">
      <div className="flex flex-col items-center justify-between px-6 py-5">
        <CardTitle className="text-base-200 text-lg leading-6 font-medium">
          SEO Improvements
        </CardTitle>
        <CardDescription>AI generated SEO recommendations</CardDescription>
      </div>
      {children}
      <CardContent className="space-y-3 p-1">
        <div>
          <div className="mb-4 flex items-center gap-2">
            {getIcon("title")}
            <h3 className="text-md text-base-500 font-semibold">
              Meta Information
            </h3>
          </div>
          {renderMetaInformation()}
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2">
            {getIcon("headings")}
            <h3 className="text-md text-base-500 font-semibold">Headings</h3>
          </div>
          {renderHeadings()}
        </div>
      </CardContent>
    </div>
  );
};
