// Function to create the prompt for the AI model
export const createPromptParts = (base: string, prompt: string, originalData: object): string => {
 
  return `
${base}
${prompt}

${JSON.stringify(originalData, null, 2).trim()}
`.trim();
};

export const createPrompt = ( prompt: string, customInstructions?: string, originalData?: object): string => {
  return `
  ${prompt}
  # Real Input:
  ${JSON.stringify(originalData, null, 2).trim()}
  `
}