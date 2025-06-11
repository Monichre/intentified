- Developed a capability to write a summary of accomplishments to a markdown file as part of ongoing project documentation and self-reflection

TODO:
Excellent clarification! You want to **implement streaming enrichment/analysis results on your landing page**, following the architecture and patterns described in [`REFACTOR.md`](mdc:packages/ai/REFACTOR.md), specifically using **AI SDK 5 streaming primitives** (e.g., `createDataStreamResponse`, `dataStream.writeData`, and client-side consumption via hooks like `useChat`).

Below is a step-by-step guide and code example for implementing this pattern in your Next.js app, using your enrichment services.

---

# 1. **Server: Create a Streaming API Route**

You need an API route (or server action) that uses `createDataStreamResponse` to stream enrichment progress/results.

**Example: `app/api/enrich-company-summary/route.ts`**
```typescript
import { createDataStreamResponse } from "ai";
import { enrichCompanySummary } from "@/ai";

export async function POST(req: Request) {
  const { websiteUrl } = await req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // Optionally stream progress
      dataStream.writeData({ type: "progress", message: "Starting enrichment..." });

      // Call the enrichment service, optionally passing a progress callback
      const result = await enrichCompanySummary(
        { websiteUrl },
        (progress) => {
          dataStream.writeData({ type: "progress", ...progress });
        }
      );

      // Stream the final result
      dataStream.writeData({ type: "result", result });
      dataStream.done();
    },
    onError: (error) => error instanceof Error ? error.message : String(error),
  });
}
```
- This streams progress and the final result as JSON objects.

---

# 2. **Client: Consume the Stream in Your Landing Page**

Use the [AI SDK React hooks](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data) (e.g., `useChat` or a custom hook) to consume the streamed data.

**Example:**
```typescript
"use client";
import { useState } from "react";

export default function LandingOne() {
  const [progress, setProgress] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  async function handleEnrich() {
    setProgress([]);
    setResult(null);

    const response = await fetch("/api/enrich-company-summary", {
      method: "POST",
      body: JSON.stringify({ websiteUrl: "https://openai.com" }),
      headers: { "Content-Type": "application/json" },
    });

    // Read the stream
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Split on newlines (assuming NDJSON or similar)
      let lines = buffer.split("\n");
      buffer = lines.pop()!; // last line may be incomplete

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.type === "progress") {
            setProgress((prev) => [...prev, data.message || JSON.stringify(data)]);
          } else if (data.type === "result") {
            setResult(data.result);
          }
        } catch (e) {
          // Ignore parse errors for incomplete lines
        }
      }
    }
  }

  return (
    <div>
      <button onClick={handleEnrich}>Stream Enrichment</button>
      <div>
        <h3>Progress:</h3>
        <ul>
          {progress.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
      {result && (
        <div>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```
- This will show streaming progress and the final result as they arrive.

---

# 3. **Best Practices from `REFACTOR.md`**

- **Use `createDataStreamResponse` for all streaming server actions.**
- **Stream progress, phase, and result updates via `dataStream.writeData`.**
- **On the client, consume the stream and update UI incrementally.**
- **Keep the server action pure and stateless.**
- **Document the API and UI usage.**

---

# 4. **Summary Table**

| Layer         | Pattern/Primitive                | Example/Reference                |
|---------------|----------------------------------|----------------------------------|
| Server        | `createDataStreamResponse`       | See above API route example      |
| Server        | `dataStream.writeData`           | Stream progress/results          |
| Client        | Fetch + stream reader            | See above client example         |
| Client (alt)  | `useChat` from AI SDK            | For chat-like streaming UIs      |

---

# 5. **References**

- [AI SDK 5 Streaming Data Docs](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data)
- [`REFACTOR.md`](mdc:packages/ai/REFACTOR.md) in your repo

---

## **You now have a streaming enrichment implementation, fully aligned with your architecture doc!**

If you want a more advanced example (e.g., using `useChat` for chat-like UIs, or streaming multiple enrichment types), let me know!