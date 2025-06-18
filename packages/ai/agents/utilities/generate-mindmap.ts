

import type { CompanyMapParams, CompanyMindMap } from "../../integrations/types"
import { askAiStructuredResponse } from "./common"
import { MODEL_REGISTRY } from "../../core/models/model-registry"
import { z } from "zod";
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"


/* ------------------------------------------------------------------ *
 * Generic model selector – switchable for testing / staging.          *
 * ------------------------------------------------------------------ */

/* ------------------ Zod schemas for structured AI output ----------- */




/* ------------------------------------------------------------------ *
 * Pure helper functions – absolutely no hidden state                 *
 * ------------------------------------------------------------------ */

// Helper function to safely stringify content for mind map generation
const safeStringify = (content: any): string => {
  if (!content) return 'No data available';
  if (typeof content === 'string') return content;
  
  // Handle Exa API response structure
  if (content.results && Array.isArray(content.results)) {
    return content.results
      .map((result: any) => {
        const parts = [];
        if (result.title) parts.push(result.title);
        if (result.text) parts.push(result.text);
        if (result.summary) parts.push(result.summary);
        return parts.join(' - ');
      })
      .join('\n');
  }
  
  // Handle company summary structure
  if (content.sections && Array.isArray(content.sections)) {
    return content.sections
      .map((section: any) => `${section.heading}: ${section.text}`)
      .join('\n');
  }
  
  // Handle object with text content
  if (typeof content === 'object') {
    if (content.text) return content.text;
    if (content.summary) return content.summary;
    if (content.description) return content.description;
  }
  
  // Fallback to JSON representation for complex objects
  return JSON.stringify(content, null, 2);
};

export const generateCompanyMindMap = async ({
  companySummary,
  mainpage,
  websiteUrl,
  competitors,
  funding,
  subpages,
}: CompanyMapParams): Promise<CompanyMindMap> => {
  
  // Safely convert all inputs to strings
  const mainPageText = safeStringify(mainpage);
  const subPagesText = safeStringify(subpages);
  const companySummaryText = safeStringify(companySummary);
  const competitorsText = safeStringify(competitors);
  const fundingText = safeStringify(funding);

   // Define a recursive schema for mind map nodes
    const mindMapNodeSchema = z.object({
      title: z.string(),
      children: z.array(z.object({
        title: z.string(),
        description: z.string(),
        children: z.array(z.object({
          title: z.string(),
          description: z.string()
        }))
      }))
    });
      const mindMapSchema = z.object({
      companyName: z.string(),
      rootNode: mindMapNodeSchema
    });

    const {object} = await generateObject({
       model:  anthropic('claude-4-sonnet-20250514'),
      schema: mindMapSchema,
    
      prompt: `You are an expert at creating insightful mind maps about companies.
      
      MAIN WEBSITE CONTENT:
      ${mainPageText}

      SUBPAGES:
      ${subPagesText}

      SUMMARY OF THE COMPANY:
      ${companySummaryText}

      COMPETITORS:
      ${competitorsText}

      FUNDING:
      ${fundingText}

      Create a mind map for the company at ${websiteUrl}. The mind map should:
      1. Have exactly 3 levels of depth
      2. Start with the company's main focus/product as the central node
      3. Branch into 3-4 main categories (Level 1) such as:
         - Core Products/Services
         - Technology/Innovation
         - Market Position/Partnerships
         - Company Mission/Values
      4. Each Level 1 category should have 2-3 subcategories (Level 2)
      5. Each Level 2 subcategory should have a clear description
      
      Keep all text concise and easy to understand. Focus on the most important aspects that would help someone quickly grasp what the company does and why it matters.
      
      Format the response as a valid JSON object matching the specified schema.`
    })

console.log("🚀 ~ object:", object)

  return object;
};