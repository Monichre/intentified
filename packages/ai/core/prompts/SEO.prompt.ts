import { SEO_CRITERIA_BASE_PROMPT } from "core/prompts/SEO_CRITERIA_BASE.prompt"
const SEO_PROMPT_INSTRUCTIONS = `
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
`
export const SEO_PROMPT = `
 
# SEO Guidelines:
${SEO_CRITERIA_BASE_PROMPT}

---
${SEO_PROMPT_INSTRUCTIONS}

---

`
