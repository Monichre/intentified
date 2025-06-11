import {
  experimental_createProviderRegistry as createProviderRegistry,
  Provider,
} from "ai";
import { openai } from "@ai-sdk/openai";

import { anthropic } from "@ai-sdk/anthropic";
import { OpenAiModels } from "./llm/openai";
import { AnthropicModels } from "./llm/anthropic";
// import { google } from "@ai-sdk/google";



export const MODEL_REGISTRY: any = {
  openai: {
    ...OpenAiModels
  },
  anthropic: {
    ...AnthropicModels
  },
  // google,
  

}

