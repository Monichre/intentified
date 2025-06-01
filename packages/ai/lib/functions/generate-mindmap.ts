

import { z } from "zod";

import {  askAiStructuredResponse, OPENAI_MODELS } from "../models"
import type { CompanyMapParams } from "@/agents/lib/types"
const {gpt4_1} = OPENAI_MODELS

/* ------------------------------------------------------------------ *
 * Generic model selector – switchable for testing / staging.          *
 * ------------------------------------------------------------------ */

/* ------------------ Zod schemas for structured AI output ----------- */




/* ------------------------------------------------------------------ *
 * Pure helper functions – absolutely no hidden state                 *
 * ------------------------------------------------------------------ */

export const generateCompanyMindMap = async ({
  companySummary,
  mainpage,
  websiteUrl,
  competitors,
  funding,
  subpages,
}: CompanyMapParams): Promise<CompanyMindMap> => {
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

    const {object} = await askAiStructuredResponse({
      model: gpt4_1,
      schema: mindMapSchema,
      system: "Create clear, concise mind maps that help users quickly understand companies. Use simple English and focus on the most important aspects.",
      prompt: `You are an expert at creating insightful mind maps about companies.
      
      MAIN WEBSITE CONTENT:
      ${mainpage}

      SUBPAGES:
      ${subpages}

      SUMMARY OF THE COMPANY:
      ${companySummary}

      COMPETITORS:
      ${competitors}

      FUNDING:
      ${funding}

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