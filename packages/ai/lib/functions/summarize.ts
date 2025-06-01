

import { generateObject } from "ai";
import { z } from "zod";

import { OPENAI_MODELS, askAiStructuredResponse } from "../../lib/models"
import type { CompanySummaryParams, CompanySummaryResult } from "@/services/enrichment"
const {gpt3o} = OPENAI_MODELS

/* ------------------------------------------------------------------ *
 * Generic model selector – switchable for testing / staging.          *
 * ------------------------------------------------------------------ */

/* ------------------ Zod schemas for structured AI output ----------- */




/* ------------------------------------------------------------------ *
 * Pure helper functions – absolutely no hidden state                 *
 * ------------------------------------------------------------------ */

export const generateCompanySummary = async ({
  subpages,
  mainpage,
  websiteUrl,
}: CompanySummaryParams): Promise<CompanySummaryResult> => {


       // Define the schema as an object with a 'sections' array
    const summarySchema = z.object({
      sections: z.array(z.object({
        heading: z.string(),
        text: z.string()
        
      }))
    });

    const {object} = await askAiStructuredResponse({
       schema: summarySchema,
       model: gpt3o,
      system: "All the output content should be in simple english. Don't use any difficult words. Keep sentences short and simple.  Use unique emojis for each heading.",
      prompt: `You are an expert at writing important points about a company.
      Here are the content from a company's website so you can understand about the company in detail.
      
      SUBPAGES CONTENT (includes about, pricing, faq, blog, etc):
      ${subpages}
      
      MAIN WEBSITE CONTENT:
      ${mainpage}
      
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
