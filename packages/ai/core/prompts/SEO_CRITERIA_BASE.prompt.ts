 export const SEO_CRITERIA_BASE_PROMPT = `
  1. **Title**:
     - Optimal length: 50-60 characters.
     - Ensure the title reflects the content topics well and is concise to avoid truncation.
     - If the title is missing or too long/short, it negatively affects SEO.
  
  2. **Meta Description**:
     - Optimal length: 120-160 characters.
     - Include primary keywords and ensure it is concise to avoid truncation.
     - If the meta description is missing or too long/short, it negatively affects SEO.
  
  3. **Keywords**:
     - Optimal density: 1-2.5%.
     - Use 3-5 primary keywords naturally and strategically.
     - Avoid keyword stuffing; ensure keywords are used naturally.
     - If the keywords are missing or density is too low/high, it negatively affects SEO.
  
  4. **Headings**:
     - Ensure headings are well-structured and follow a logical hierarchy (H1 > H2 > H3).
     - Include primary keywords in headings where appropriate.
     - If the heading structure is poor or keywords are missing, it negatively affects SEO.
  
  Use these criteria to provide improvements.
    `.trim();