"use server";

import { z } from "zod";

import { redirect } from "next/navigation";
import { setupCrawling } from "@/features/pipelines/seo/lib/crawl"
import { evaluateAll } from "@/features/pipelines/seo/lib/seo"
import type { SEOData, WebVitals, CollectionPeriod, CoreVitalsAssessment } from "@/features/pipelines/seo/lib/types"
import { convertToHttps } from "@/features/pipelines/seo/lib/utils"
import { fetchCrUXData } from "@/features/pipelines/seo/lib/web-vitals"



const formDataSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
});

/**
 * Crawls SEO data for the given URL.
 * @param _ Unused parameter.
 * @param formData Form data containing the URL.
 */
async function crawlSeoDataSubAction(_: any, formData: FormData) {
  const url = formData.get("url") as string; // Extract URL from FormData
  const convertedUrl = convertToHttps(url); // Convert URL to HTTPS

  console.log({ url });
  console.log({ convertedUrl });

  try {
    // Call setupCrawling and wait for it to finish and return the data
    const results = await setupCrawling(convertedUrl);
    return results;
  } catch (error) {
    console.error(`Error during the SEO data crawl for ${url}:`, error);
    throw error;
  }
}

/**
 * Fetches performance data for the given URL.
 * @param _ Unused parameter.
 * @param formData Form data containing the URL.
 */
async function perfDataSubAction(_: any, formData: FormData) {
  const url = formData.get("url") as string;
  const convertedUrl = convertToHttps(url); // Convert URL to HTTPS

  try {
    const perfData = await fetchCrUXData(convertedUrl);
    return perfData;
  } catch (error) {
    console.error(`Failed to fetch performance data for URL ${url}:`, error);
    return null;
  }
}

interface ScrapeFormState {
  allSeoData: SEOData[];
  rawWebVitals: {
    record: {
      key: {
        url: string;
      };
      metrics: WebVitals;
      collectionPeriod: CollectionPeriod;
    };
  } | null;
  coreVitalsAssessment: CoreVitalsAssessment | null;
}

/**
 * Recursively removes `rawData` fields from the SEO feedback object.
 * @param seoFeedback SEO feedback object.
 * @returns Cleaned SEO feedback object without `rawData` fields.
 */
function omitRawDataFromSEOFeedback(seoFeedback: any): any {
  if (seoFeedback) {
    for (const key in seoFeedback) {
      if (seoFeedback[key] && typeof seoFeedback[key] === "object") {
        if (seoFeedback[key].hasOwnProperty("rawData")) {
          delete seoFeedback[key].rawData;
        }
        omitRawDataFromSEOFeedback(seoFeedback[key]);
      }
    }
  }
  return seoFeedback;
}

/**
 * Handles combined actions for the given URL, including crawling SEO data and fetching performance data.
 * Also applies rate limiting and stores the results in Redis.
 * @param prevState Previous state (unused).
 * @param formData Form data containing the URL.
 * @returns The combined scrape form state along with SEO feedback and OpenGraph data.
 */
export async function combinedUrlActions(
  prevState: any,
  formData: FormData
): Promise<
  | (ScrapeFormState & {
      seoFeedback: any;
      ogImageData: any;
      timestamp: string;
    })
  | null
> {
  const url = formData.get("url") as string;
  const result = formDataSchema.safeParse({ url });

  if (!result.success) {
    // Redirect if the URL is invalid
    redirect("/?status=invalid_url");
  }

  try {
    // Run SEO data crawling and performance data fetching in parallel
    const [allSeoData, perfData] = await Promise.all([
      crawlSeoDataSubAction(prevState, formData),
      perfDataSubAction(prevState, formData),
    ]);

    const scrapeFormState: ScrapeFormState = {
      allSeoData: allSeoData ?? [],
      rawWebVitals: perfData?.rawWebVitals ?? null,
      coreVitalsAssessment: perfData?.coreVitalsAssessment ?? null,
    };

    // Evaluate SEO feedback and extract OpenGraph data
    let seoFeedback =
      scrapeFormState.allSeoData.length > 0
        ? evaluateAll(scrapeFormState.allSeoData)
        : null;
    const ogImageData =
      scrapeFormState.allSeoData.length > 0
        ? scrapeFormState.allSeoData[0].openGraph
        : null;

    // Remove `rawData` field from SEO feedback
    seoFeedback = omitRawDataFromSEOFeedback(seoFeedback);

    // Generate a timestamp for the current operation
    const timestamp = new Date().toISOString();

    return {
      ...scrapeFormState,
      seoFeedback,
      ogImageData,
      timestamp,
    };
  } catch (error) {
    console.error(`Failed to process combined actions for URL ${url}:`, error);
    return null;
  }
}

/**
 * Analyzes the SEO data and generates improvements based on the current SEO feedback.
 * @param result The result from combinedUrlActions which includes SEO data, OpenGraph data, etc.
 * @returns The original and updated SEOData with improvements.
 */

export interface SEODiff {
  originalData: {
    title: string;
    metaDescription: string;
    keywords: string;
    headings: Record<string, string[]>;
  };
  improvedData: {
    title?: string;
    metaDescription?: string;
    keywords?: string;
    headings?: Record<string, string[]>;
  };
  children?: any;
}

export async function improveSEOAction(
  result: ScrapeFormState & {
    seoFeedback: any;
    ogImageData: any;
    timestamp: string;
  }
): Promise<SEODiff> {
  try {
    const apiUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/ai-analyze"
        : `https://cult-seo.vercel.app/api/ai-analyze`; // Provide a fallback default URL

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Response not ok:", response);
      throw new Error(
        errorData.error || "An error occurred while improving SEO"
      );
    }

    const data: SEODiff = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to improve SEO:", error);
    throw error;
  }
}

//
