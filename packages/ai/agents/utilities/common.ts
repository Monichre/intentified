

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



