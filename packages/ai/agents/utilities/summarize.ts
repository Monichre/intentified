


import { z } from "zod";


import type { CompanySummaryParams, CompanySummaryResult } from "../../domains/enrichment"

import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateText, generateObject } from 'ai';


/* ------------------------------------------------------------------ *
 * Generic model selector – switchable for testing / staging.          *
 * ------------------------------------------------------------------ */

/* ------------------ Zod schemas for structured AI output ----------- */




/* ------------------------------------------------------------------ *
 * Pure helper functions – absolutely no hidden state                 *
 * ------------------------------------------------------------------ */

// Helper function to extract text content from Exa API response
const extractTextFromExaResponse = (response: any): string => {
  if (!response) return 'No content available';
  
  // If it's already a string, return it
  if (typeof response === 'string') return response;
  
  // If it has results array (standard Exa response)
  if (response.results && Array.isArray(response.results)) {
    return response.results
      .map((result: any) => {
        const parts = [];
        if (result.title) parts.push(`Title: ${result.title}`);
        if (result.text) parts.push(`Content: ${result.text}`);
        if (result.summary) parts.push(`Summary: ${result.summary}`);
        return parts.join('\n');
      })
      .filter(Boolean)
      .join('\n\n');
  }
  
  // If it's an object but not standard format, try to extract useful content
  if (typeof response === 'object') {
    if (response.text) return response.text;
    if (response.content) return response.content;
    if (response.summary) return response.summary;
  }
  
  // Last resort - return a message indicating the structure
  return `Content structure: ${Object.keys(response || {}).join(', ')}`;
};

export const generateCompanySummary = async ({
  subpages,
  mainpage,
  websiteUrl,
}: CompanySummaryParams): Promise<CompanySummaryResult> => {

  // Extract text content from the Exa API responses
  const mainPageText = extractTextFromExaResponse(mainpage);
  const subPagesText = extractTextFromExaResponse(subpages);

       // Define the schema as an object with a 'sections' array
    const summarySchema = z.object({
      sections: z.array(z.object({
        heading: z.string(),
        text: z.string()
        
      }))
    });

    const {object} = await generateObject({
       schema: summarySchema,
       model:  anthropic('claude-4-sonnet-20250514'),
  
      prompt: `You are an expert at writing important points about a company.
      Here are the content from a company's website so you can understand about the company in detail.
      
      SUBPAGES CONTENT (includes about, pricing, faq, blog, etc):
      ${subPagesText}
      
      MAIN WEBSITE CONTENT:
      ${mainPageText}
      
      Now, after understanding about this company whose url is ${websiteUrl}, give me headings and the relevant content about it.

      Headings could be the companys's: Main Product, Target Users, Pricing, Goal, Strengths, and more key points, whichever are relevant. Don't have to include a specific heading if it doesn't have enough source about it, and you can also make up your own headings whichever seems apt.
      
      Don't make up any information yourself, only use the information which is given in the above content.

      It should be (an emoji with heading) and then text with it. Give maximum 6 headings (the most important ones).

      The text/description should be short, simple and easy to understand.

      All the output content should be in simple english.

      Use unique emojis for each heading.
      
      Output the result as JSON.`
    })

 
    

    
  console.log("🚀 ~ object:", object)

  return object;
};
