import { LLModels } from "../model-types";
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';


export const AnthropicModels: any = {
 CLAUDE_37_SONNET: {
    model: anthropic("claude-3-7-sonnet-latest"),
    id: "claude-3-7-sonnet-latest",
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    providerId: "anthropic",
    status: "online",
    capability: ["text", "tool", "files", "images"],
  },
  CLAUDE_SONNET_4: {
    model: anthropic("claude-sonnet-4-20250514"),
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    providerId: "anthropic",
    status: "online",
    capability: ["text", "tool", "files", "images"],
  },
  CLAUDE_OPUS_4: {
    model: anthropic("claude-opus-4-20250514"),
    id: "claude-opus-4-20250514",
    name: "Claude Opus 4",
    provider: "Anthropic",
    providerId: "anthropic",
    status: "online",
    capability: ["text", "tool", "files", "images"],
  }
  // v0 model from Vercel AI SDK UI. Consider moving to a unified registry if not Anthropic-specific.

}
 

