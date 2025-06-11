import { openai } from "@ai-sdk/openai"
import { LLModels } from "../model-types";

export const OpenAiModels: LLModels[] = {
  GPT_4_1: {
    id: "gpt-4.1",
    model: openai.responses("gpt-4.1"),
    name: "GPT-4.1",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
  GPT_4_1_MINI: {
    id: "gpt-4.1-mini",
    model: openai.responses("gpt-4.1-mini"),
    name: "GPT-4.1 Mini",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
  GPT_4_5: {
    id: "gpt-4.5",
    model: openai.responses("gpt-4.5"),
    name: "GPT-4.5",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
  O3_MINI: {
    id: "o3-mini",
    model: openai.responses("o3-mini"),
    name: "O3 Mini",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },

  
  GPT_4O: {
    id: "gpt-4o",
    model: openai.responses("gpt-4o"),
    name: "GPT-4o",
    provider: "OpenAI",
    providerId: "openai",
    status: "online",
    capability: ["text", "tool", "files", "images"],
  },
}

