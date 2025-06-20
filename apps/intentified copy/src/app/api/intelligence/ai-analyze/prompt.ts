// Function to create the prompt for the AI model
export const createPrompt = (originalData: object): string => {
  const rubric = `
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

  return `
  Analyze and improve the following website's SEO data based on the given example and guidelines. Your goal is to enhance the website's title, metaDescription, keywords, and headings to achieve excellent SEO.
  
  # Example Input:
  {
    "title": "Learn the Basics of Programming",
    "metaDescription": "A comprehensive guide to help beginners learn the basics of programming.",
    "keywords": "programming, basics, beginners",
    "headings": {
      "h1": ["Introduction"],
      "h2": ["Getting Started", "Basic Concepts", "Next Steps"],
      "h3": []
    }
  }
  
  # Example Improved Output:
  {
    "title": "Master Programming Basics: A Beginner's Guide",
    "metaDescription": "Master the basics of programming with our comprehensive guide designed for beginners.",
    "keywords": "master programming, programming basics, beginner's guide",
    "headings": {
      "h1": ["Master Programming Basics"],
      "h2": ["Getting Started with Programming", "Understanding Basic Concepts", "Planning Your Next Steps"],
      "h3": ["Setting Up Your Environment", "Writing Your First Program", "Learning Advanced Topics"]
    }
  }
  
  # SEO Guidelines:
  ${rubric}
  
  # Real Input:
  ${JSON.stringify(originalData, null, 2).trim()}
    `.trim();
};
