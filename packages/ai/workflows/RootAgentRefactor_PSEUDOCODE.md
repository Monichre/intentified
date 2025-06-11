# RootAgentRefactor_PSEUDOCODE.md

## Purpose
Refactor the agent workflow to use a model registry, custom tool container, and proper streaming UI updates. Ensure modularity, type safety, and extensibility.

---

## Pseudocode

1. **Imports**
   - Import model registry (e.g., `getModelByName`)
   - Import `toolContainer` for tools
   - Import `AssistantMessage` React component
   - Import streaming and UI primitives from AI SDK
   - Import types/interfaces as needed

2. **Define Payload Interface**
   - `RootAgentPayload` with `model`, `messages`, `uiStream`

3. **agent Function**
   - Accepts `RootAgentPayload`
   - Initialize `fullResponse`, `responseMessages`, `toolResults`
   - Log or persist incoming messages for debugging
   - Create a streamable text value for incremental updates

4. **Model Selection**
   - Use `getModelByName(model)` to get the correct model implementation
   - Handle errors if model is not found

5. **Tool Preparation**
   - Use `toolContainer` to get tools, passing context if needed (e.g., `uiStream`)

6. **Streaming Setup**
   - Call `streamText` with:
     - `model` (from registry)
     - `messages`
     - `tools` (from toolContainer)
     - `onStepFinish` to update UI (append/update `AssistantMessage`)
     - `onFinish` to collect response messages and tool results

7. **Streaming Loop**
   - For each delta in `fullStream`:
     - If delta is text, update `fullResponse` and streamable text

8. **Finalize**
   - Mark streamable text as done
   - Build and return payload with model, text, response messages, tool results

9. **Export**
   - Export `agent` as a named export

---

## Notes
- Use dependency injection for model and tools
- Ensure all types are properly defined
- Use functional, named exports
- Document all major steps in the implementation 