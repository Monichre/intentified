import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { removeEmptyHeadings } from "@/utils/utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createPrompt } from "./prompt";

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
const errorResponse = (message: string, status: number): NextResponse =>
  NextResponse.json({ success: false, message }, { status });

// Initialize rate limiting if environment variables are set
let ratelimit: Ratelimit | null = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    }),
    limiter: Ratelimit.fixedWindow(29, "1 d"),
    ephemeralCache: new Map(),
    analytics: true,
  });
}

// Function to generate improved data using the AI model
const generateImprovedData = async (
  anthropic: any,
  openai: any,
  schema: any,
  prompt: string
): Promise<any> => {
  if (anthropic) {
    return generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema,
      prompt,
    });
  } else if (openai) {
    return generateObject({
      model: openai.chat("gpt-4.1"),
      schema,
      prompt,
      mode: "json",
    });
  } else {
    throw new Error("No AI provider is configured.");
  }
};

// Function to handle POST requests
export async function POST(req: NextRequest) {
  // Check rate limit
  if (ratelimit) {
    const ip = req.headers.get("x-real-ip") ?? "local";
    const rl = await ratelimit.limit(ip);
    if (!rl.success) {
      return errorResponse(
        "You've reached your maximum AI usage for today. You can use the manual editor and get 5 more free AI requests tomorrow",
        429
      );
    }
  }

  try {
    // Parse request data
    const { seoFeedback, allSeoData } = await req.json();
    const { title, metaDescription, keywords, headings } = allSeoData[0];

    // Validate required fields
    if (!title || !metaDescription || !headings) {
      return NextResponse.json(
        { error: "Required fields are missing in the SEO data." },
        { status: 400 }
      );
    }

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
    const { object: improvedData } = await generateImprovedData(
      anthropic,
      openai,
      schema,
      prompt
    );

    const response = { originalData, improvedData };

    // Validate the response data
    const validationResult = SEODiffSchema.safeParse(response);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed.", details: validationResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
