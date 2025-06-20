"use server";

import { z } from "zod";

import { redirect } from "next/navigation";
import { setupCrawling } from "./crawl";
import { evaluateAll } from "./seo";
import type {
  SEOData,
  WebVitals,
  CollectionPeriod,
  CoreVitalsAssessment,
} from "./types";
import { convertToHttps } from "./utils";
import { fetchCrUXData } from "./web-vitals";
import { enrichment } from "@repo/ai/services";
// Company enrichment interfaces
export interface CompanyEnrichmentData {
  basicInfo?: {
    description: string;
    category: string;
  };
  companySummary?: {
    sections: Array<{
      heading: string;
      text: string;
    }>;
  };
  funding?: {
    hasFunding: boolean;
    details?: string;
    summary?: string;
  };
  linkedin?: {
    url: string;
    content: string;
  };
  founders?: Array<{
    name?: string;
    linkedinUrl: string;
    title?: string;
  }>;
  competitors?: Array<{
    name: string;
    description: string;
    website?: string;
  }>;
}

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

  // Enhanced logging for debugging domain issues
  console.log("=== URL Processing Debug ===");
  console.log("Original URL from form:", url);
  console.log("Converted URL:", convertedUrl);

  try {
    const parsedUrl = new URL(convertedUrl);
    console.log("Parsed domain:", parsedUrl.hostname);
    console.log("Full parsed URL:", parsedUrl.toString());
  } catch (parseError) {
    console.error("URL parsing failed:", parseError);
    throw new Error(`Invalid URL format: ${convertedUrl}`);
  }

  try {
    // Call setupCrawling and wait for it to finish and return the data
    const results = await setupCrawling(convertedUrl);
    console.log("Crawling completed successfully for:", convertedUrl);
    return results;
  } catch (error) {
    console.error(
      `Error during the SEO data crawl for ${convertedUrl}:`,
      error,
    );
    console.error("Original URL was:", url);
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

/**
 * Enriches company data for the given URL using the bulk enrichment API.
 * @param _ Unused parameter.
 * @param formData Form data containing the URL.
 */
async function enrichCompanyDataSubAction(
  _: any,
  formData: FormData,
): Promise<CompanyEnrichmentData | null> {
  console.log("🚀 ~ enrichCompanyDataSubAction ~ formData:", formData);

  const url = formData.get("url") as string;
  const convertedUrl = convertToHttps(url);
  const { enrichCompanyData } = enrichment;

  try {
    console.log("Starting company enrichment for:", convertedUrl);

    const data = await enrichCompanyData({
      websiteUrl: convertedUrl,
    });

    console.log("🚀 ~ enrichCompanyDataSubAction ~ data:", data);

    // Transform the API response to match our interface
    const enrichmentData: CompanyEnrichmentData = {...data, companySummary: {sections: data?.results.map((r: any) => ({heading: r.type, text: r.text}))}};

    console.log("Company enrichment completed successfully for:", convertedUrl);
    return {
      ...enrichmentData,
      data,
      companySummary: {
        sections: data?.results.map((r: any) => ({heading: r.type, text: r.text}))
      }
    };
  } catch (error) {
    console.error(`Failed to enrich company data for URL ${url}:`, error);
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
  companyEnrichment?: CompanyEnrichmentData | null;
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
  formData: FormData,
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
    // Run SEO data crawling, performance data fetching, and company enrichment in parallel
    const [allSeoData, perfData, companyEnrichment] = await Promise.all([
      crawlSeoDataSubAction(prevState, formData),
      perfDataSubAction(prevState, formData),
      enrichCompanyDataSubAction(prevState, formData),
    ]);

    console.log("🚀 ~ companyEnrichment:", companyEnrichment);

    const scrapeFormState: ScrapeFormState = {
      allSeoData: allSeoData ?? [],
      rawWebVitals: perfData?.rawWebVitals ?? null,
      coreVitalsAssessment: perfData?.coreVitalsAssessment ?? null,
      companyEnrichment: companyEnrichment ?? null,
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
      companyEnrichment,
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
  },
): Promise<SEODiff> {
  try {
    const apiUrl =
      process.env.NODE_ENV === "development"
        ? typeof window !== "undefined"
          ? `${window.location.origin}/api/ai-analyze`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/ai-analyze`
        : `https://cult-seo.vercel.app/api/ai-analyze`; // Provide a fallback default URL

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });

    console.log("🚀 ~ response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Response not ok:", response);
      throw new Error(
        errorData.error || "An error occurred while improving SEO",
      );
    }

    const data: SEODiff = await response.json();

    console.log("🚀 ~ data:", data);

    return data;
  } catch (error) {
    console.error("Failed to improve SEO:", error);
    throw error;
  }
}

//
