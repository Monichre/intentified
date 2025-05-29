import { Exa } from 'exa-js';
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateObject, generateText, tool } from "ai";
import FirecrawlApp from '@mendable/firecrawl-js';

export const EXA_CLIENT = new Exa(process.env.EXA_API_KEY);
export const FIRECRAWAL_APP = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
export const OPENAI_MODELS = {
  gpt4_1:  openai.responses('gpt-4.1'),
  gpt3o:  openai.responses('gpt-3o'),
  
};

export const ANTHROPIC_MODELS = {
  
  SONNET_37: anthropic('claude-3-7-sonnet-latest'),
  SONNET_4: anthropic('claude-4-sonnet-20250514'),
  SONNET_35: anthropic("claude-3-5-sonnet-latest"),
  
};

 const exaWebSearch = tool({
  description: 'Search the web for up-to-date information',
  parameters: z.object({
    query: z.string().min(1).max(100).describe('The search query'),
  }),
  execute: async ({ query }) => {
    const { results } = await EXA_CLIENT.searchAndContents(query, {
      livecrawl: 'always',
      numResults: 3,
    });
    return results.map(result => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000), // take just the first 1000 characters
      publishedDate: result.publishedDate,
    }));
  },
});





 const firecrawlWebSearch = tool({
  description: 'Search the web for up-to-date information',
  parameters: z.object({
    urlToCrawl: z
      .string()
      .url()
      .min(1)
      .max(100)
      .describe('The URL to crawl (including http:// or https://)'),
  }),
  execute: async ({ urlToCrawl }) => {
    const crawlResponse = await FIRECRAWAL_APP.crawlUrl(urlToCrawl, {
      limit: 1,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      },
    });
    if (!crawlResponse.success) {
      throw new Error(`Failed to crawl: ${crawlResponse.error}`);
    }
    return crawlResponse.data;
  },
});



export const askAiStructuredResponse = async ({prompt, system, schema, tools, model}: {prompt: string, system?: string, schema?: z.ZodSchema, tools?: any, model?: any}) => {

const { object } = await generateObject({
  model: model,
  // @ts-ignore
  schema: schema,
  prompt: prompt,
  system: system,
  tools: tools,
   
});

return {object}
}

export const askAiTextResponse = async ({prompt, system, model, tools}: {prompt: string, system?: string, model?: any, tools?: any}) => {
const { text } = await generateText({
  model: model,
  system: system,
  prompt: prompt,
  tools: tools,
});

return text
}


export const askSonnetWithThinking = async ({prompt, system, schema, tools, model}: {prompt: string, system?: string, schema?: z.ZodSchema, tools?: any, model?: any}) => {
const { text, reasoning, reasoningDetails } = await generateText({
  model: ANTHROPIC_MODELS.SONNET_37,
  system: system,
  prompt: prompt,
  tools: tools,
  
  
});
return {text, reasoning, reasoningDetails}

}


export const askAiWithWebSearch = async ({prompt, system, model, client}: {prompt: string, system?: string, model?: any, client?: any}) => {
  const webSearch = client === 'exa' ? exaWebSearch : firecrawlWebSearch
const { text } = await generateText({
  model: model,
  system: system,
  prompt: prompt,
     tools: {
      webSearch,
    },
    maxSteps: 5
});
return text
}



