import PQueue from "p-queue";
import { load } from "cheerio";
import { URL } from "url"; // Node.js URL module for URL resolution
import { OpenGraph, SEOData, TwitterCard } from "./types";

// Converts a string to camelCase format
function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

// Extracts SEO-related data from a parsed HTML document using Cheerio
function extractSEOData($: any, url: string) {
  const title = $("title").text() || null;
  const metaDescription = $('meta[name="description"]').attr("content") ?? null;

  const keywords = $('meta[name="keywords"]').attr("content") ?? null;
  const content = extractContent($); // Extract the main text content

  const robots = $('meta[name="robots"]').attr("content") ?? null;
  const canonical = $('link[rel="canonical"]').attr("href") ?? null;
  const images = extractImages($);

  const openGraph = extractMetaTags($, "og:");
  const twitterCard = extractTwitterCardTags($, "twitter:");

  const headings = extractHeadings($);
  const links = extractLinks($);

  return {
    url,
    title,
    metaDescription,
    keywords,
    robots,
    content,
    canonical,
    openGraph,
    twitterCard,
    headings,
    images,
    links,
  };
}

// Interface defining the options for configuring the crawling process
export interface CrawlOptions {
  concurrency: number; // Number of concurrent requests
  maxDepth: number; // Maximum depth of the crawl
  maxTotalLinks: number; // Maximum total number of links to process
  onProgress?: (
    url: string,
    depth: number,
    remaining: number,
    totalProcessed: number
  ) => void; // Callback function for progress updates
  onError?: (error: Error, url: string) => void; // Callback function for error handling
}

// Default options for the crawling process
const defaultOptions: CrawlOptions = {
  concurrency: 5,
  maxDepth: 2,
  maxTotalLinks: 4, // Adjusted for more thorough crawling
  onProgress: undefined,
  onError: undefined,
};

// Fetches the HTML content of a webpage given its URL
async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    if (!contentType || !contentType.includes("text/html")) {
      throw new Error(`Expected HTML but received ${contentType}`);
    }
    return response.text();
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error}`);
  }
}

// Main function to set up and start the crawling process
export async function setupCrawling(
  startUrl: string,
  options: Partial<CrawlOptions> = {}
): Promise<SEOData[]> {
  const { concurrency, maxDepth, maxTotalLinks, onProgress, onError } = {
    ...defaultOptions,
    ...options,
  };
  const queue = new PQueue({ concurrency });
  const visitedUrls = new Set();
  const allSeoData: SEOData[] = [];

  // Recursive function to handle crawling of a single webpage
  async function handlePage(url: string, depth: number = 0) {
    if (
      visitedUrls.has(url) ||
      depth > maxDepth ||
      allSeoData.length >= maxTotalLinks
    )
      return;
    visitedUrls.add(url);
    onProgress?.(url, depth, queue.pending, allSeoData.length);

    try {
      const html = await fetchHTML(url);
      const $ = load(html);
      console.log("Title:", $("title").text()); // Check title
      console.log("Keywords:", $('meta[name="keywords"]').attr("content")); // Check meta keywords

      // Log all H1 headings to see if they are being captured
      $("h1").each(function () {
        console.log("H1:", $(this).text());
      });
      const seoData = extractSEOData($, url); // Directly pass the CheerioAPI object
      allSeoData.push(seoData);

      const links = extractFollowLinks($, new URL(url).hostname);
      links.forEach((link) => {
        if (
          !visitedUrls.has(link) &&
          depth < maxDepth &&
          allSeoData.length < maxTotalLinks
        ) {
          queue.add(() => handlePage(link, depth + 1));
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error, url);
      } else {
        onError?.(new Error("An unexpected error occurred"), url);
      }
    }
  }

  await queue.add(() => handlePage(startUrl));
  await queue.onIdle();
  return allSeoData;
}

// extract the main text content from the body of the webpage. This content will be a simple concatenation of all text nodes, which can be used for further analysis, like keyword density checks.
// function extractContent($: any): string {
//   return $("body").text().replace(/\s\s+/g, " ").trim(); // Extract text and reduce multiple spaces to single
// }

function extractContent($: any): string {
  // Define a selector to gather text from common text-holding elements
  const selector = "p, h1, h2, h3, h4, h5, h6, li";

  // Select the first 20 text-holding elements from the body and map their text content
  const textBlocks = $("body")
    .find(selector)
    .slice(0, 40)
    .map((_, el) => $(el).text().trim())
    .get() // Convert Cheerio object to an array
    .join(" ") // Join the extracted text blocks with spaces, ensuring readability
    .replace(/\s\s+/g, " ")
    .trim();

  return textBlocks;
}

// Extracts all internal links from a webpage that should be followed for crawling
function extractFollowLinks($: any, baseDomain: string): string[] {
  // Ensure baseDomain includes the protocol
  const base = new URL(
    baseDomain.startsWith("http") ? baseDomain : `https://${baseDomain}`
  );
  return $("a")
    .map((_: any, el: any) => $(el).attr("href"))
    .get()
    .map((href: any) => {
      if (!href) return null;
      try {
        // Attempt to create a full URL considering possible relative links
        if (href.startsWith("http") || href.startsWith("//")) {
          // Properly handle protocol-relative URLs
          href = href.startsWith("//") ? "https:" + href : href;
          return new URL(href).toString();
        } else {
          // Assume href is a relative link and resolve against base
          return new URL(href, base).toString();
        }
      } catch (error) {
        console.error(`Invalid href found: ${href}`, error);
        return null; // Ignore invalid URLs
      }
    })
    .filter((url: any) => url && new URL(url).hostname === base.hostname); // Only keep internal links
}

function extractTwitterCardTags($: any, prefix: string): TwitterCard {
  const tags: any = {};
  $(`meta[name^="${prefix}"], meta[property^="${prefix}"]`).each(
    (_: any, el: any) => {
      const key = $(el).attr("name") || $(el).attr("property");
      const cleanKey = key ? toCamelCase(key.replace(prefix, "")) : "";
      const value = $(el).attr("content");
      if (cleanKey && value) tags[cleanKey] = value;
    }
  );

  // Ensure all TwitterCard properties are set, using defaults or null as fallbacks
  return {
    card: tags.card || "",
    site: tags.site || "",
    creator: tags.creator || "",
    title: tags.title || "",
    description: tags.description || "",
    image: tags.image || "",
  };
}

function extractMetaTags($: any, prefix: string): OpenGraph {
  const tags: any = {};
  $(`meta[name^="${prefix}"], meta[property^="${prefix}"]`).each(
    (_: any, el: any) => {
      const key = $(el).attr("name") || $(el).attr("property");
      const cleanKey = key ? toCamelCase(key.replace(prefix, "")) : "";
      const value = $(el).attr("content");
      if (cleanKey && value) tags[cleanKey] = value;
    }
  );

  // Ensure all OpenGraph properties are set, using defaults or null as fallbacks
  return {
    title: tags.title || "",
    description: tags.description || "",
    url: tags.url || "",
    siteName: tags.siteName || "",
    image: tags.image || "",
    type: tags.type || "",
  };
}

// Interface defining the structure of an image tag
interface ImgTag {
  src: string;
  alt: string | null;
}

// Extracts image tags from a webpage
function extractImages($: any): ImgTag[] {
  const images: ImgTag[] = [];
  $("img").each((_: any, el: any) => {
    const src = $(el).attr("src") || ""; // Default to empty string if src is undefined
    const alt = $(el).attr("alt") ?? null; // Use null if alt is undefined
    images.push({ src, alt });
  });
  return images;
}

// Extracts heading tags (h1-h6) from a webpage
function extractHeadings($: any): Record<string, string[]> {
  const headings: Record<string, string[]> = {};
  $("h1, h2, h3, h4, h5, h6").each((_: any, el: any) => {
    const level = $(el).prop("tagName").toLowerCase(); // Ensure it's in lowercase
    if (!headings[level]) headings[level] = [];
    headings[level].push($(el).text().trim());
  });
  return headings;
}

// Extracts links (text and href) from a webpage
function extractLinks($: any): { text: string; href: string }[] {
  return $("a")
    .map((_: any, el: any) => ({
      text: $(el).text().trim(),
      href: $(el).attr("href")?.trim() || "",
    }))
    .get()
    .filter(
      (link: any) =>
        link.href &&
        !link.href.startsWith("javascript:") &&
        !link.href.includes("twitter.com/intent")
    );
}

// Extracts meta tags with a specified prefix from a webpage
// function extractMetaTags($: any, prefix: string): Record<string, string> {
//   const tags: Record<string, string> = {};
//   $(`meta[name^="${prefix}"], meta[property^="${prefix}"]`).each(
//     (_: any, el: any) => {
//       const key = $(el).attr("name") || $(el).attr("property");
//       const cleanKey = key ? toCamelCase(key.replace(prefix, "")) : "";
//       const value = $(el).attr("content");
//       if (cleanKey && value) tags[cleanKey] = value;
//     }
//   );
//   return tags;
// }

// Interface defining the structure of the SEO data extracted from a webpage
// export interface SEOData {
//   url: string;
//   title: string | null;
//   metaDescription: string | null;
//   keywords: string | null;
//   robots: string | null;
//   canonical: string | null;
//   openGraph: Record<string, string>;
//   twitterCard: Record<string, string>;
//   headings: Record<string, string[]>;
//   links: { text: string; href: string }[];
//   images: ImgTag[];
// }

// import PQueue from "p-queue";
// import { load } from "cheerio";
// import { URL } from "url"; // Node.js URL module for URL resolution

// export interface SEOData {
//   url: string;
//   title: string | null;
//   metaDescription: string | null;
//   keywords: string | null;
//   robots: string | null;
//   canonical: string | null;
//   openGraph: Record<string, string>;
//   twitterCard: Record<string, string>;
//   headings: Record<string, string[]>;
//   links: { text: string; href: string }[];
//   images: ImgTag[];
// }

// function toCamelCase(str: string): string {
//   return str
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
// }
// function extractSEOData($: any, url: string): SEOData {
//   const title = $("title").text() || null;
//   const metaDescription = $('meta[name="description"]').attr("content") ?? null;
//   const keywords = $('meta[name="keywords"]').attr("content") ?? null;
//   const robots = $('meta[name="robots"]').attr("content") ?? null;
//   const canonical = $('link[rel="canonical"]').attr("href") ?? null;
//   const images = extractImages($);

//   const openGraph = extractMetaTags($, "og:");
//   const twitterCard = extractMetaTags($, "twitter:");

//   const headings = extractHeadings($);
//   const links = extractLinks($);

//   return {
//     url,
//     title,
//     metaDescription,
//     keywords,
//     robots,
//     canonical,
//     openGraph,
//     twitterCard,
//     headings,
//     images,
//     links,
//   };
// }

// export interface CrawlOptions {
//   concurrency: number;
//   maxDepth: number;
//   maxTotalLinks: number;
//   onProgress?: (
//     url: string,
//     depth: number,
//     remaining: number,
//     totalProcessed: number
//   ) => void;
//   onError?: (error: Error, url: string) => void;
// }

// const defaultOptions: CrawlOptions = {
//   concurrency: 5,
//   maxDepth: 2,
//   maxTotalLinks: 4, // Adjusted for more thorough crawling
//   onProgress: undefined,
//   onError: undefined,
// };

// async function fetchHTML(url: string): Promise<string> {
//   try {
//     const response = await fetch(url);
//     const contentType = response.headers.get("content-type");

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     if (!contentType || !contentType.includes("text/html")) {
//       throw new Error(`Expected HTML but received ${contentType}`);
//     }
//     return response.text();
//   } catch (error) {
//     throw new Error(`Failed to fetch ${url}: ${error}`);
//   }
// }

// export async function setupCrawling(
//   startUrl: string,
//   options: Partial<CrawlOptions> = {}
// ): Promise<SEOData[]> {
//   const { concurrency, maxDepth, maxTotalLinks, onProgress, onError } = {
//     ...defaultOptions,
//     ...options,
//   };
//   const queue = new PQueue({ concurrency });
//   const visitedUrls = new Set();
//   const allSeoData: SEOData[] = [];

//   async function handlePage(url: string, depth: number = 0) {
//     if (
//       visitedUrls.has(url) ||
//       depth > maxDepth ||
//       allSeoData.length >= maxTotalLinks
//     )
//       return;
//     visitedUrls.add(url);
//     onProgress?.(url, depth, queue.pending, allSeoData.length);

//     try {
//       const html = await fetchHTML(url);
//       const $ = load(html);
//       console.log("Title:", $("title").text()); // Check title
//       console.log("Keywords:", $('meta[name="keywords"]').attr("content")); // Check meta keywords

//       // Log all H1 headings to see if they are being captured
//       $("h1").each(function () {
//         console.log("H1:", $(this).text());
//       });
//       const seoData = extractSEOData($, url); // Directly pass the CheerioAPI object
//       allSeoData.push(seoData);

//       const links = extractFollowLinks($, new URL(url).hostname);
//       links.forEach((link) => {
//         if (
//           !visitedUrls.has(link) &&
//           depth < maxDepth &&
//           allSeoData.length < maxTotalLinks
//         ) {
//           queue.add(() => handlePage(link, depth + 1));
//         }
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         onError?.(error, url);
//       } else {
//         onError?.(new Error("An unexpected error occurred"), url);
//       }
//     }
//   }

//   await queue.add(() => handlePage(startUrl));
//   await queue.onIdle();
//   return allSeoData;
// }

// function extractFollowLinks($: any, baseDomain: string): string[] {
//   // Ensure baseDomain includes the protocol
//   const base = new URL(
//     baseDomain.startsWith("http") ? baseDomain : `https://${baseDomain}`
//   );
//   return $("a")
//     .map((_: any, el: any) => $(el).attr("href"))
//     .get()
//     .map((href: any) => {
//       if (!href) return null;
//       try {
//         // Attempt to create a full URL considering possible relative links
//         if (href.startsWith("http") || href.startsWith("//")) {
//           // Properly handle protocol-relative URLs
//           href = href.startsWith("//") ? "https:" + href : href;
//           return new URL(href).toString();
//         } else {
//           // Assume href is a relative link and resolve against base
//           return new URL(href, base).toString();
//         }
//       } catch (error) {
//         console.error(`Invalid href found: ${href}`, error);
//         return null; // Ignore invalid URLs
//       }
//     })
//     .filter((url: any) => url && new URL(url).hostname === base.hostname); // Only keep internal links
// }

// function extractMetaTags($: any, prefix: string): Record<string, string> {
//   const tags: Record<string, string> = {};
//   $(`meta[name^="${prefix}"], meta[property^="${prefix}"]`).each(
//     (_: any, el: any) => {
//       const key = $(el).attr("name") || $(el).attr("property");
//       const cleanKey = key ? toCamelCase(key.replace(prefix, "")) : "";
//       const value = $(el).attr("content");
//       if (cleanKey && value) tags[cleanKey] = value;
//     }
//   );
//   return tags;
// }

// interface ImgTag {
//   src: string;
//   alt: string | null;
// }

// function extractImages($: any): ImgTag[] {
//   const images: ImgTag[] = [];
//   $("img").each((_: any, el: any) => {
//     const src = $(el).attr("src") || ""; // Default to empty string if src is undefined
//     const alt = $(el).attr("alt") ?? null; // Use null if alt is undefined
//     images.push({ src, alt });
//   });
//   return images;
// }

// function extractHeadings($: any): Record<string, string[]> {
//   const headings: Record<string, string[]> = {};
//   $("h1, h2, h3, h4, h5, h6").each((_: any, el: any) => {
//     const level = $(el).prop("tagName").toLowerCase(); // Ensure it's in lowercase
//     if (!headings[level]) headings[level] = [];
//     headings[level].push($(el).text().trim());
//   });
//   return headings;
// }

// function extractLinks($: any): { text: string; href: string }[] {
//   return $("a")
//     .map((_: any, el: any) => ({
//       text: $(el).text().trim(),
//       href: $(el).attr("href")?.trim() || "",
//     }))
//     .get()
//     .filter(
//       (link: any) =>
//         link.href &&
//         !link.href.startsWith("javascript:") &&
//         !link.href.includes("twitter.com/intent")
//     );
// }

// interface Heading {
//   level: string;
//   text: string;
// }

// interface ImgTag {
//   src: string;
//   alt: string;
// }

// interface SEOData {
//   url: string;
//   title: string | null;
//   metaDescription: string | null;
//   keywords: string | null;
//   robots: string | null;
//   canonical: string | null;
//   openGraph: Record<string, string>;
//   twitterCard: Record<string, string>;
//   headings: Record<string, string[]>;
//   links: { text: string; href: string }[];
// }

// function toCamelCase(str: string): string {
//   return str
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
// }

// async function fetchHTML(url: string): Promise<string> {
//   try {
//     const response = await fetch(url);
//     const contentType = response.headers.get("content-type");

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     if (!contentType || !contentType.includes("text/html")) {
//       throw new Error(`Expected HTML but received ${contentType}`);
//     }
//     return response.text();
//   } catch (error) {
//     throw new Error(`Failed to fetch ${url}: ${error}`);
//   }
// }

// function extractSEOData(html: string, url: string): SEOData {
//   const $ = load(html);
//   const title = $("title").text();
//   const metaDescription = $('meta[name="description"]').attr("content");
//   const keywords = $('meta[name="keywords"]').attr("content");
//   const robots = $('meta[name="robots"]').attr("content");
//   const canonical = $('link[rel="canonical"]').attr("href");
//   const openGraph = {};
//   const twitterCard = {};

//   $("meta").each((_:any, el:any) => {
//     const property = $(el).attr("property") || $(el).attr("name");
//     if (property) {
//       if (property.startsWith("og:")) {
//         const cleanKey = toCamelCase(property.replace("og:", ""));
//         openGraph[cleanKey] = $(el).attr("content");
//       }
//       if (property.startsWith("twitter:")) {
//         const cleanKey = toCamelCase(property.replace("twitter:", ""));
//         twitterCard[cleanKey] = $(el).attr("content");
//       }
//     }
//   });

//   const headings = {};
//   $("h1, h2, h3, h4, h5, h6").each((_:any, el:any) => {
//     const level = $(el).get(0).tagName.toLowerCase();
//     if (!headings[level]) headings[level] = [];
//     headings[level].push($(el).text());
//   });

//   const links = $("a")
//     .map((_:any, el:any) => ({
//       text: $(el).text(),
//       href: $(el).attr("href"),
//     }))
//     .get()
//     .filter((link) => link.href);

//   return {
//     url,
//     title,
//     metaDescription,
//     keywords,
//     robots,
//     canonical,
//     openGraph,
//     twitterCard,
//     headings,
//     links,
//   };
// }

// // The rest of the setupCrawling function and other utility functions remain unchanged, integrating extractSEOData as needed.

// export interface CrawlOptions {
//   concurrency: number;
//   maxDepth: number;
//   maxTotalLinks: number;
//   onProgress?: (
//     url: string,
//     depth: number,
//     remaining: number,
//     totalProcessed: number
//   ) => void;
//   onError?: (error: Error, url: string) => void;
// }

// const defaultOptions: CrawlOptions = {
//   concurrency: 5,
//   maxDepth: 2,
//   maxTotalLinks: 100,
//   onProgress: undefined,
//   onError: undefined,
// };

// async function setupCrawling(
//   startUrl: string,
//   options: Partial<CrawlOptions> = {}
// ): Promise<SEOData[]> {
//   const { concurrency, maxDepth, maxTotalLinks, onProgress, onError } = {
//     ...defaultOptions,
//     ...options,
//   };
//   const queue = new PQueue({ concurrency });
//   const visitedUrls = new Set<string>();
//   const allSeoData: SEOData[] = [];

//   async function handlePage(url: string, depth: number = 0) {
//     if (
//       visitedUrls.has(url) ||
//       depth > maxDepth ||
//       allSeoData.length >= maxTotalLinks
//     )
//       return;
//     visitedUrls.add(url);
//     onProgress?.(url, depth, queue.pending, allSeoData.length);

//     try {
//       const body = await fetchHTML(url);
//       const seoData = extractSEOData(body, url);
//       allSeoData.push(seoData);

//       const links = extractFollowLinks($(body), new URL(url).hostname);
//       links.forEach((link) => {
//         if (
//           !visitedUrls.has(link) &&
//           depth < maxDepth &&
//           allSeoData.length < maxTotalLinks
//         ) {
//           queue.add(() => handlePage(link, depth + 1));
//         }
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         onError?.(error, url);
//       } else {
//         onError?.(new Error("An unexpected error occurred"), url);
//       }
//     }
//   }

//   await queue.add(() => handlePage(startUrl));
//   await queue.onIdle();

//   return allSeoData;
// }

// function extractFollowLinks($: any, baseDomain: string): string[] {
//   const base = new URL(
//     baseDomain.startsWith("http") ? baseDomain : `https://${baseDomain}`
//   );
//   return $("a")
//     .map((_: number, el: Element) => $(el).attr("href"))
//     .get()
//     .map((href: string) => {
//       if (!href) return null;
//       try {
//         if (href.startsWith("http") || href.startsWith("//")) {
//           href = href.startsWith("//") ? "https:" + href : href;
//           return new URL(href).toString();
//         } else {
//           return new URL(href, base).toString();
//         }
//       } catch (error) {
//         console.error(`Invalid href found: ${href}`, error);
//         return null; // Ignore invalid URLs
//       }
//     })
//     .filter(
//       (url: string | null) => url && new URL(url).hostname === base.hostname
//     ); // Only keep internal links
// }

// function extractMetaTags($: any, prefix: string): Record<string, string> {
//   const tags: Record<string, string> = {};
//   $(`meta[name^="${prefix}"], meta[property^="${prefix}"]`).each(
//     (_: any, el: any) => {
//       const key = $(el).attr("name") || $(el).attr("property");
//       const value = $(el).attr("content");
//       if (key && value) tags[key] = value;
//     }
//   );
//   return tags;
// }

// function extractHeadings($: any): Record<string, string[]> {
//   const headings: Record<string, string[]> = {};
//   ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((level) => {
//     headings[level] = $(level)
//       .map((_: any, el: any) => $(el).text().trim())
//       .get();
//   });
//   return headings;
// }

// function extractLinks($: any): { text: string; href: string }[] {
//   return $("a")
//     .map((_: any, el: any) => ({
//       text: $(el).text().trim(),
//       href: $(el).attr("href")?.trim() ?? "",
//     }))
//     .get()
//     .filter(
//       ({ href }: { href: string }) =>
//         href &&
//         !href.startsWith("javascript:") &&
//         !href.includes("twitter.com/intent")
//     );
// }
