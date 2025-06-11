import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import anthropic from "@ai-sdk/anthropic";
export const runtime = "edge";

// Initialize AI SDKs with API keys
const anthropic = process.env.ANTHROPIC_API_KEY
  ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const openai = process.env.OPENAI_API_KEY
  ? createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Define schema for expected input and output data
const SEODiffSchema = z.object({
  originalData: z.object({
    title: z.string(),
    metaDescription: z.string(),
    keywords: z.string(),
    headings: z.record(z.string(), z.array(z.string())),
  }),
  improvedData: z.object({
    title: z.string(),
    metaDescription: z.string(),
    keywords: z.string(),
    headings: z.record(z.string(), z.array(z.string())),
  }),
});

// Helper function to create error responses



export const generateImprovedSEO = async ({seoFeedback, allSeoData}: any) => {
  const { title, metaDescription, keywords, headings } = allSeoData[0];

    // Filter headings to remove empty entries
    const filteredHeadings = removeEmptyHeadings(headings);

    // Prepare original data for AI processing
    const originalData = {
      title: title.trim(),
      metaDescription: metaDescription.trim(),
      keywords: (keywords || "").trim(),
      headings: filteredHeadings,
    };

    // Define schema for the expected LLM output
    const schema = z.object({
      title: z.string().describe("The improved title of the webpage."),
      metaDescription: z
        .string()
        .describe("The improved meta description of the webpage."),
      keywords: z.string().describe("The improved keywords for the webpage."),
      headings: z
        .record(z.string(), z.array(z.string()))
        .describe("The improved headings of the webpage.")
        .optional(),
    });

    // Generate the prompt
    const prompt = createPrompt(originalData);

    // Generate improved data using the AI model
    const { object: improvedData } = await generateObject({
      model: anthropic("claude-4-sonnet-20250514"),
      schema,
      prompt,
    });
    const response = { originalData, improvedData };

    return response;
}
