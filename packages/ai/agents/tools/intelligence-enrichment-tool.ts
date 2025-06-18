import { tool } from "ai";
import { z } from "zod";
import { decideProceedOrInquire } from "../../workflows/intelligence-enrichment";

/**
 * Zod schema for the tool input parameters.
 */
export const intelligenceEnrichmentInputSchema = z.object({
  model: z.string().describe("The model to use for decision making (e.g., 'gemini-1.5-pro-exp-0827')."),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system", "tool"]),
    content: z.any(),
  })).describe("The conversation history as an array of CoreMessage objects."),
  scope: z.enum(["current", "global"]).optional().describe("Scope for decision: 'current' (last message) or 'global' (all messages). Defaults to 'current'."),
});

/**
 * Agent tool for deciding if a query should proceed or requires inquiry.
 */
export const intelligenceEnrichmentTool = tool({
  description: `Determines if a user query is ready to proceed or requires more information (inquire). Returns a binary decision: 'proceed' or 'inquire'. Useful for workflow branching, inquiry panels, or agent task management.`,
  parameters: intelligenceEnrichmentInputSchema,
  execute: async (params) => {
    return await decideProceedOrInquire(params);
  },
}); 