"use client";
import { useState } from "react";
import {
  X,
  Info,
  Percent,
  Database,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { cn, getGrade } from "@/lib/utils";
import { SEOFeedback } from "@/lib/types";
import { getIcon } from "../ui/icons";

interface Props {
  seoFeedback: SEOFeedback[];
}

export function SEOScoreSection({ seoFeedback }: Props) {
  const [expandedDetail, setExpandedDetail] = useState<{
    index: number;
    key: string;
  } | null>(null);

  const toggleDetail = (index: number, key: string) => {
    setExpandedDetail(
      expandedDetail?.index === index && expandedDetail?.key === key
        ? null
        : { index, key }
    );
  };

  // prettier-ignore
  const infoTextMap = {
    title: "The title tag of a web page is meant to be an accurate and concise description of a page's content. It is critical to both user experience and SEO.",
    metaDescription: "Meta descriptions provide concise explanations of the contents of web pages. They are commonly used on search engine result pages to display preview snippets for a given page.",
    images: "Images can significantly impact your site's load time and user engagement. Ensure each image has an alt text and is optimized for fast loading.",
    headings: "Headings help organize the content on your page for both users and search engines. Ensure your headings are structured hierarchically (H1, then H2, etc.) and include relevant keywords to improve SEO.",
    keywords: "Keywords are words or phrases that describe content. They are used by search engines to populate search results. It is important to balance keyword density and relevance."
  };

  // Calculate the total SEO score and total possible score across all items
  const totalScore =
    seoFeedback?.reduce((acc, feedback) => acc + feedback.score, 0) ?? 0;
  //   prettier-ignore
  const totalPossibleScore = seoFeedback?.reduce((acc, feedback) => acc + feedback.totalPossibleScore, 0) ?? 0;
  //   prettier-ignore
  const scorePercentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore * 100).toFixed(2) : 0;

  return (
    <div className="max-w-5xl mx-auto   p-2 ">
      <Card className=" bg-base-900 relative ">
        <CardHeader className="flex justify-between flex-row items-center pb-2">
          <CardTitle className="text-2xl tracking-tight text-base-300 absolute top-4 md:top-2 left-3">
            SEO Score Card
          </CardTitle>
          <CardDescription className="absolute top-8 left-3 text-base-500/80 hidden md:block">
            Snapshot of how your site can improve SEO
          </CardDescription>
          <div className="text-lg bg-base-800/80 p-1 py-1.5 px-1.5 rounded-lg text-base-300 flex items-center gap-2 shadow absolute top-0.5 right-2 rounded-tr-[16px]">
            <span
              className={cn(
                "text-xl tracking-tight leading-snug font-bold text-yellow-100 px-3 py-1 bg-base-950 rounded-md  shadow-inner-shadow",
                getGradeColor(scorePercentage)
              )}
            >
              {/* @ts-ignore */}
              {getGrade(scorePercentage)}
            </span>
            <div className="flex items-center gap-1 tracking-tighter font-mono text-base  pr-1">
              {scorePercentage} <Percent className="h-5 w-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-2 pt-10 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {seoFeedback?.map((feed, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg py-2.5 px-2 shadow bg-gradient-to-b  from-base-950 to-base-975 ",
                  seoFeedback.length - 2 === index
                    ? "md:rounded-bl-[16px]"
                    : "",
                  seoFeedback.length - 1 === index
                    ? "rounded-b-[16px] md:rounded-br-[16px]"
                    : ""
                )}
              >
                <div className="flex items-center justify-between mb-2 text-base-500/80">
                  <span className="text-sm  truncate">{feed.url}</span>
                  <span className="text-sm ">
                    {feed.score} / {feed.totalPossibleScore}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                  {Object.entries(feed.details).map(([key, detail]) => (
                    <motion.div
                      key={key}
                      layoutId={`detail-${index}-${key}`}
                      onClick={() => toggleDetail(index, key)}
                      className=" rounded-[9px]  cursor-pointer px-px pb-px shadow-inner-shadow   bg-base-900"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      layout
                    >
                      <div>
                        <div className="flex items-center justify-between p-2">
                          <span className="flex items-center gap-2">
                            <span>{getIcon(key)} </span>
                            <motion.span
                              layoutId={`detail-url-${index}-${key}`}
                              className="text-sm  capitalize text-base-300"
                            >
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </motion.span>
                          </span>
                          <span className="text-xs text-base-300/80">
                            {detail.score} / {detail.maxScore}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {expandedDetail && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 md:bg-opacity-50 z-50 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedDetail(null)}
          >
            <motion.div
              layoutId={`detail-${expandedDetail.index}-${expandedDetail.key}`}
              className=" md:max-w-lg w-full max-w-[22rem]"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{
                opacity: 1,
                transition: { type: "spring", bounce: 0.2, duration: 0.3 },
                filter: "blur(0px)",
              }}
            >
              <DetailCard
                title={`${
                  expandedDetail.key.charAt(0).toUpperCase() +
                  expandedDetail.key.slice(1)
                } Analysis`}
                subtitle="Detailed insights and suggestions"
                negativeFeedback={seoFeedback[expandedDetail.index].details[
                  expandedDetail.key
                ].negativeFeedback.filter((f) => f)}
                positiveFeedback={seoFeedback[expandedDetail.index].details[
                  expandedDetail.key
                ].positiveFeedback.filter((f) => f)}
                info={
                  infoTextMap[expandedDetail.key] ||
                  "No additional information available."
                }
                score={(
                  (seoFeedback[expandedDetail.index].details[expandedDetail.key]
                    .score /
                    seoFeedback[expandedDetail.index].details[
                      expandedDetail.key
                    ].maxScore) *
                  100
                ).toFixed(2)}
                detailKey={expandedDetail}
                rawData={seoFeedback[expandedDetail.index].rawData}
              />
              <motion.div className="flex justify-center ">
                <button
                  onClick={() => setExpandedDetail(null)}
                  className="bg-base-975 py-2 px-4 rounded-b-md flex gap-1 items-center"
                >
                  <X />
                  <span>Close</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DetailCardProps {
  title: string;
  subtitle: string;
  negativeFeedback: string[];
  positiveFeedback: string[];
  rawData: any;
  info: string;
  score: string;
  detailKey: { index: number; key: string };
}

function DetailCard({
  title,
  subtitle,
  negativeFeedback,
  rawData,
  info,
  detailKey,
  positiveFeedback,
  score,
}: DetailCardProps) {
  const renderRawData = (key: string) => {
    switch (key) {
      case "title":
      case "metaDescription":
        return (
          <div className="border border-base-950/10 space-y-3 bg-base-975/60 rounded-lg px-4 py-3">
            <div className="text-sm font-medium text-base-200/90">
              <span className="text-base-300">URL:</span> {rawData.url}
            </div>
            <div className="text-sm font-medium text-base-200/90">
              <span className="text-base-300">Title:</span> {rawData.title}
            </div>
            <div className="text-sm font-medium text-base-200/90">
              <span className="text-base-300">Meta Description:</span>{" "}
              {rawData.metaDescription}
            </div>
          </div>
        );
      case "images":
        return (
          <div className="border border-base-950/10 rounded-lg shadow-sm px-4 py-3 bg-base-975/60">
            <h3 className="text-sm font-semibold text-base-200/90/70">
              Img alt text
            </h3>
            {rawData.images && (
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {rawData.images.map((image, index) => (
                  <li key={index} className="text-base-200/80">
                    {image.alt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "headings":
        return (
          <>
            <div className="border border-base-950/10 rounded-lg shadow px-4 py-3  bg-base-975/60">
              <div className="text-sm font-semibold text-base-200/90 dark:text-white">
                <span className="flex items-center mb-2">
                  <svg
                    className="h-5 w-5 text-cyan-light mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Headings
                </span>
                <div className="text-base-300 dark:text-base-400">
                  <strong>H1:</strong>
                  <span className="ml-2">
                    {joinHeadings(rawData.headings?.h1)}
                  </span>
                </div>
                <div className="text-base-300 dark:text-base-400">
                  <strong>H2:</strong>
                  <span className="ml-2">
                    {joinHeadings(rawData.headings?.h2)}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      case "keywords":
        return (
          <div className="border border-base-950/10 bg-base-975/60 rounded-lg shadow-sm px-4 py-3">
            <div className="text-sm font-medium text-base-200/90">
              <strong>Keywords</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {rawData?.keywords?.split(",").map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-orange-light/70 text-orange-50 text-sm px-2 py-1 rounded-full"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="border border-base-950/10 rounded-lg shadow-sm px-4 py-3 bg-base-975/60">
            <div className="text-sm font-medium text-base-200/90">
              No specific data available
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-lg rounded-[10px] overflow-hidden bg-gradient-to-t from-base-975 via-base-950 to-base-950  shadow-inner-shadow">
      <CardHeader className="px-3 py-5 sm:px-3 flex items-center flex-row justify-between ">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-800">
            {getIcon(detailKey.key)}
          </div>
          <div>
            <CardTitle className="text-lg leading-6 font-medium  text-base-200">
              <motion.span
                layout
                layoutId={`detail-url-${detailKey.index}-${detailKey.key}`}
              >
                {title}
              </motion.span>
            </CardTitle>
            <p className="text-sm text-base-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "rounded-full  px-3 py-1 text-base font-light shadow-inner-shadow  flex gap-1 items-center ",
              getScoreColor(score)
            )}
          >
            <span>{score.replace(".00", "")}</span>
            <Percent className="h-4 w-4 text-base-700" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-1.5">
        <div className="flex flex-col gap-1 overflow-hidden rounded-[9px]  px-px pb-px pt-1  bg-base-900 shadow-inner-shadow">
          <div className="p-4 space-y-4 ">
            {/* Positive Feedback */}
            {positiveFeedback.length >= 1 ? (
              <section>
                <div className=" text-base-500/80 flex items-center gap-1">
                  <CheckCircle
                    className={cn(
                      "h-4 w-4",
                      "fill-green-light/20 stroke-green-light"
                    )}
                  />
                  <h3 className="text-sm font-semibold">Positive Feedback</h3>
                </div>
                <ul className="mt-2 space-y-2">
                  {positiveFeedback.map((item, index) => (
                    <li
                      key={index}
                      className={cn(
                        "p-2 rounded-md text-sm ",
                        "border border-dashed border-green-light/20 bg-green-light/5"
                      )}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {/* Negative Feedback */}
            {negativeFeedback.length >= 1 ? (
              <section>
                <div className=" text-base-500/80 flex items-center gap-1">
                  <MessageCircle
                    className={cn(
                      "h-4 w-4",
                      "fill-red-light/20 stroke-red-light"
                    )}
                  />
                  <h3 className="text-sm font-semibold">Negative Feedback</h3>
                </div>
                <ul className="mt-2 space-y-2">
                  {negativeFeedback.map((item, index) => (
                    <li
                      key={index}
                      className="p-2 rounded-md text-sm border border-dashed border-red-light/20 bg-red-light/5 "
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {/* Raw Data */}
            <section>
              <div className=" text-base-500/80 flex items-center gap-1">
                <Database
                  className={cn("h-4 w-4", getKeyFillColor(detailKey.key))}
                />
                <h3 className="text-sm font-semibold">Data</h3>
              </div>
              <ScrollArea className="h-[139px]">
                <ul className="mt-2 space-y-2">
                  {renderRawData(detailKey.key)}
                </ul>
              </ScrollArea>
            </section>
            {/* Info */}
            <section>
              <div className=" text-base-500/80 flex items-center gap-1">
                <Info
                  className={cn("h-4 w-4", getKeyFillColor(detailKey.key))}
                />
                <h3 className="text-sm font-semibold">Info</h3>
              </div>
              <p className="mt-2 text-sm text-base-500">{info}</p>
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getGradeColor(score: number | string) {
  const scoreNum = Number(score);
  if (scoreNum >= 80) {
    return "bg-base-950 text-green-light"; // Green for scores 70 and above
  } else if (scoreNum >= 50) {
    return "bg-base-950 text-yellow-light"; // Yellow for scores between 50 and 69
  } else {
    return "bg-base-950 text-red-light"; // Red for scores below 50
  }
}

function joinHeadings(headings: string[]) {
  return headings && headings.length > 0
    ? headings.join(", ")
    : "No headings found";
}

function getScoreColor(score: number | string) {
  const scoreNum = Number(score);
  if (scoreNum >= 70) {
    return "bg-base-900 text-green-light/60"; // Green for scores 70 and above
  } else if (scoreNum >= 50) {
    return "bg-base-900 text-yellow-light/60"; // Yellow for scores between 50 and 69
  } else {
    return "bg-base-900 text-red-light/60"; // Red for scores below 50
  }
}

function getKeyFillColor(key: string) {
  switch (key) {
    case "title":
      return "fill-blue-light/20 stroke-blue-light";
    case "metaDescription":
      return "fill-yellow-light/20 stroke-yellow-light";
    case "images":
      return "fill-purple-light/20 stroke-purple-light";
    case "headings":
      return "fill-green-light/20 stroke-cyan-light";
    case "keywords":
      return "fill-orange-light/20 stroke-orange-light";
    default:
      return "fill-base-500/20 stroke-base-500";
  }
}

export function SkeletonCard() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[105px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
