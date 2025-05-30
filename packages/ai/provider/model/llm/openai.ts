import { LLModels } from "../model-types";

export const OpenAiModels: LLModels[] = [
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
  {
    id: "gpt-3o",
    name: "GPT-3o",
    provider: "OpenAI",
    providerId: "openai",
    status: "disabled",
    capability: ["text", "tool", "files", "images"],
  },
] as const;
