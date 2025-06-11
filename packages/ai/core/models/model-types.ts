import type { anthropic } from "@ai-sdk/anthropic"
import type { openai } from "@ai-sdk/openai"

export type Model = {
  id: string;
  name: string;
  model: string | typeof anthropic | typeof openai;
  provider: string;
  providerId: string;
  status?: "online" | "disabled" | "experimental";
  capability?: ("tool" | "files" | "text" | "images")[];
};

export type LLModels = {
  id: string;
  model: typeof anthropic;
  name: string;
  provider:
    | "OpenAI"
    | "Groq"
    | "Google"
    | "Azure"
    | "Ollama"
    | "XAi"
    | "Anthropic"
    | ({} & string);
  providerId:
    | "openai"
    | "google"
    | "groq"
    | "azure"
    | "ollama"
    | "xai"
    | "anthropic"
    | ({} & string);
  status?: "online" | "disabled" | "experimental";
  capability?: ("tool" | "files" | "text" | "images")[];
};
