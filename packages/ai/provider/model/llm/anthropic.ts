import { LLModels } from "../model-types";

export const AnthropicModels: LLModels[] = [
  {
    id: "claude-3-7-sonnet-latest",
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    providerId: "anthropic",
    status: "enabled",
    capability: ["text", "tool", "files", "images"],
  },
  {
    id: "sonnet-4",
    name: "Sonnet-4",
    provider: "Anthropic",
    providerId: "anthropic",
    status: "enabled",
    capability: ["text", "tool", "files", "images"],
  },
  // v0 model from Vercel AI SDK UI. Consider moving to a unified registry if not Anthropic-specific.
  {
    id: "v0",
    name: "Vercel v0",
    provider: "Vercel",
    providerId: "vercel",
    status: "enabled",
    capability: ["text", "tool", "files", "images"],
  },
] as const;
