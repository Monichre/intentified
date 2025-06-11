import { serperRequestSchema } from "./schema"
import { serper } from "../../integrations/serper"
import { tool } from "ai";

  

const TOOL_DESCRIPTION = ``;

export const serperSearch = tool({
  description: TOOL_DESCRIPTION,
  parameters: serperRequestSchema,
  execute: async (request) => {
    const contentResult = await serper.search(request);
    return contentResult ?? "An error occured or search doesn't return value!";
  },
});
