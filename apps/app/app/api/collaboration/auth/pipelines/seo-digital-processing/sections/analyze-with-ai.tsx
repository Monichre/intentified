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
import { Spinner } from "@/components/ui/loading-spinner";
import { Button, LoadingButton } from "@/components/ui/button";

import { SEODiff, improveSEOAction } from "../../app/actions";

import { cn } from "@/lib/utils";
import { getIcon } from "../ui/icons";
import { toast } from "sonner";

interface Props {
  seoData: any;
}

const buttonCopy = {
  idle: "Analyze with AI",
  loading: <Spinner size={20} color="rgba(0, 0, 0, 0.65)" />,
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
    <div className="max-w-5xl mx-auto p-2">
      <Card className="w-full  shadow-lg relative overflow-hidden bg-base-900 shadow-inner-shadow lg:min-w-[200px]">
        {!generation ? (
          <CardHeader className="px-6 pt-3  pb-0 flex items-center justify-between ">
            <CardTitle className="text-lg leading-6 font-medium text-base-200">
              <StarsIcon className="fill-cyan-light/40 stroke-cyan-light stroke-1" />
            </CardTitle>
            <LoadingButton
              buttonCopy={buttonCopy}
              status={status}
              className="bg-gradient-to-b from-cyan-light to-cyan "
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
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-6 mb-2" />
                    <Skeleton className="h-6 mb-2" />
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
      }
    );
  };

  const renderMetaInformation = () => (
    <section className="bg-gradient-to-t from-base-950 via-base-875 to-base-975 shadow-inner-shadow px-2 py-2 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {hasChanges(originalData.title, improvedData.title) && (
          <motion.div
            className="rounded-[9px] cursor-pointer px-px pb-px shadow-inner-shadow bg-base-900 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => copyToClipboard(improvedData.title)}
          >
            <CardHeader className="flex items-center justify-end pt-3 pb-0 flex-row">
              <span className="mt-1">{getIcon("title")}</span>
              <CardTitle className="ml-2">Title</CardTitle>
            </CardHeader>
            <CardContent className="gap-4 flex flex-col ">
              <div className="text-base-200 flex flex-col mt-auto pr-2">
                <span className="text-base-300/80 text-[10px] w-8 px-0.5 py-0.5 rounded-t-sm text-center">
                  Old
                </span>
                <div className="flex flex-wrap text-xs pr-3 gap-1 bg-base-800 rounded-lg py-2 px-2 border border-dashed border-base-100/20">
                  {originalData.title}
                </div>
              </div>

              <div className="text-base-200 flex flex-col pr-2">
                <span className="text-green-light text-[10px] bg-black/40 w-8 px-0.5 py-0.5 rounded-t-sm text-center">
                  New
                </span>
                <div className="flex flex-wrap text-sm pr-3 gap-1 bg-black/40 rounded-b-lg rounded-r-lg py-2 px-2">
                  {improvedData.title}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}

        {hasChanges(originalData.keywords, improvedData.keywords) && (
          <motion.div
            className="rounded-[9px] cursor-pointer px-px pb-px shadow-inner-shadow bg-base-900 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => copyToClipboard(improvedData.keywords)}
          >
            <CardHeader className="flex items-center justify-end pt-3 pb-0 flex-row">
              <span className="mt-1">{getIcon("keywords")}</span>
              <CardTitle className="ml-2">Keywords</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 justify-center pb-1 pl-3 pr-1">
              <div className="text-base-200 flex flex-col pr-2 gap-1">
                <span className="text-base-300/80 text-[10px] w-8 px-0.5 py-0.5">
                  Old
                </span>
                <div className="flex flex-wrap text-sm pr-3 gap-0.5">
                  {originalData.keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="py-0.5 px-1 bg-base-800 rounded-md text-xs border border-dashed border-base-100/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-base-200 flex flex-col pr-2">
                <span className="text-green-light text-[10px] bg-black/40 w-8 px-0.5 py-0.5 rounded-t-sm text-center">
                  New
                </span>
                <div className="flex flex-wrap text-sm pr-3 gap-1 bg-black/40 rounded-b-lg rounded-r-lg py-2 px-2">
                  {improvedData.keywords.split(",").map((keyword, index) => (
                    <span
                      key={index}
                      className="py-1 px-2 bg-base-700/40 rounded-md"
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
          improvedData.metaDescription
        ) && (
          <motion.div
            className={cn(
              "rounded-[9px] cursor-pointer px-px pb-px shadow-inner-shadow bg-base-900 w-full",
              hasChanges(originalData.title, improvedData.title) &&
                hasChanges(originalData.keywords, improvedData.keywords)
                ? "md:col-span-2"
                : "col-span-1"
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

            <CardContent className="flex flex-col gap-2 justify-center pl-3 pr-1 pb-2">
              <div className="text-base-200 flex flex-col pr-2 gap-1">
                <span className="text-base-300/80 text-[10px] w-8 px-0.5 py-0.5">
                  Old
                </span>
                <div className="flex flex-wrap text-sm pr-3 gap-1 bg-base-800 px-2 py-1 rounded-lg border border-dashed border-base-100/20">
                  {originalData.metaDescription}
                </div>
              </div>

              <div className="text-base-200 flex flex-col gap-0 pr-2">
                <span className="text-green-light text-[10px] bg-black/40 w-8 px-0.5 py-0.5 rounded-t-sm text-center">
                  New
                </span>
                <div className="flex flex-wrap text-sm pr-3 gap-1 bg-black/40 rounded-b-lg rounded-r-lg px-2 py-1">
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
    <section className="bg-gradient-to-t from-base-975 via-base-950 to-base-975 shadow-inner-shadow px-2 py-2 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
                  className="rounded-[9px] cursor-pointer px-px pb-px shadow-inner-shadow bg-base-900"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => copyToClipboard(improvedHeading)}
                >
                  <div className="flex items-center gap-3 h-full relative">
                    <CardHeader className="pl-3 pr-1 py-2 absolute top-0 right-2">
                      <div className="flex items-start justify-center text-base-500">
                        <Hash className="h-4 w-4 mt-0.5" />
                        <CardTitle className="ml-1 text-sm">
                          {tag.toUpperCase()}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center pr-2 pl-2 py-2">
                      <div className="text-base-500 flex flex-col pr-2">
                        <span className="text-base-300/80 text-xs w-8 px-0.5 py-0.5">
                          Old
                        </span>
                        <span className="leading-5 text-xs md:pr-9">
                          {heading}
                        </span>
                      </div>
                      <div className="text-sm mt-2 text-base-200 flex flex-col">
                        <span className="text-green-light text-xs bg-black/40 w-8 px-0.5 py-0.5 rounded-sm text-center">
                          New
                        </span>
                        <p className="leading-5 text-xs bg-black/40 rounded-b-lg rounded-r-lg px-2 py-1 overflow-hidden">
                          {improvedHeading}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                </motion.div>
              )
            );
          })
        )}
      </div>
    </section>
  );

  return (
    <div className="w-full rounded-[10px] overflow-hidden">
      <div className="px-6 py-5 flex flex-col items-center justify-between">
        <CardTitle className="text-lg leading-6 font-medium text-base-200">
          SEO Improvements
        </CardTitle>
        <CardDescription>AI generated SEO recommendations</CardDescription>
      </div>
      {children}
      <CardContent className="p-1 space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {getIcon("title")}
            <h3 className="text-md font-semibold text-base-500">
              Meta Information
            </h3>
          </div>
          {renderMetaInformation()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            {getIcon("headings")}
            <h3 className="text-md font-semibold text-base-500">Headings</h3>
          </div>
          {renderHeadings()}
        </div>
      </CardContent>
    </div>
  );
};
