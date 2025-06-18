import { nextActionDecisionSchema } from "../agents/tools/schema/intelligence-enrichment"

import { CoreMessage, generateObject } from "ai";
import { MODEL_REGISTRY } from "../core/models/model-registry"


/**
 * Decision-making service for determining if a query is ready to proceed or requires more information.
 * Returns: { decision: "proceed" | "inquire" }
 */
export type NextActionDecision = {
  decision: "proceed" | "inquire";
};

const SYSTEM_INSTRUCTION = `Company Enrichment and Competitive Analysis Sequence

Primary Objective:
Develop a precise decision-making framework to determine the most appropriate response strategy for user queries.

Decision Criteria:

1. Context Assessment
   - Thoroughly evaluate the completeness and clarity of the user's query
   - Identify potential information gaps or ambiguities
   - Determine the feasibility of generating a comprehensive response

2. Response Strategy Evaluation

   A. "Proceed" Conditions:
      - Query is specific and well-defined
      - Sufficient contextual information is available
      - Clear path to generating a comprehensive response exists
      - No critical information is missing

   B. "Inquire" Conditions:
      - Query lacks essential details
      - Multiple potential interpretations exist
      - Additional context would significantly improve response quality
      - Critical information is needed to provide a precise answer

3. Decision-Making Process

   Step 1: Company Enrichment
   - Parse the query's explicit and implicit requirements
   - Identify key information domains
   - Assess the query's completeness

   Step 2: Competitive Analysis
   - Determine if existing information enables a comprehensive response
   - Identify specific areas requiring clarification

   Step 3: Analysis of the results
   - Choose between "proceed" or "inquire"
   - Select the option that maximizes response accuracy and relevance

4. Stream UI Response
   - Strictly limited to two possible outputs: "proceed" or "inquire"
   - Decision must be binary and definitive
   - No additional explanatory text or alternatives allowed

Guiding Principle:
Optimize the response strategy to deliver the most precise, contextually relevant information while maintaining clarity and user engagement.

Example Scenarios:

Proceed Scenario:
Input: "What are the current specifications of the iPhone 15 Pro?"
Reasoning: Clear, specific query with a direct research path

Inquire Scenario:
Input: "What phone should I buy?"
Reasoning: Requires additional context about user preferences, budget, and needs

Final Instruction:
Produce a single, unambiguous output of either "proceed" or "inquire" that best represents the query's information sufficiency and research potential.`;

export type DecideProceedOrInquirePayload = {
  model: string;
  messages: CoreMessage[];
  scope?: "current" | "global";
};

/**
 * Pure service function to decide if a query should proceed or requires inquiry.
 * @param {DecideProceedOrInquirePayload} params
 * @returns {Promise<NextActionDecision>}
 */
export async function decideProceedOrInquire({
  model,
  messages,
  scope = "current",
}: DecideProceedOrInquirePayload): Promise<NextActionDecision> {
  try {
    const currentMessages = messages.slice(-1).map((m) => ({ ...m, role: "user" } as CoreMessage));
    const payloadMessages = scope === "current" ? currentMessages : messages;
    const { object } = await generateObject({
      model: MODEL_REGISTRY.anthropic.CLAUDE_4_SONNET_20240229.model,
      system: SYSTEM_INSTRUCTION,
      messages: payloadMessages,
      schema: nextActionDecisionSchema,
    });
    return object;
  } catch (error) {
    // Return a default/fallback or rethrow as needed
    throw new Error(`Failed to decide proceed/inquire: ${error instanceof Error ? error.message : String(error)}`);
  }
}
