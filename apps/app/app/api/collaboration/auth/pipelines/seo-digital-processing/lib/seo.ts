import { SEOData, SEODetail, SEODetails, SEOFeedback } from "@/lib/types";
import { calculateSemanticRelevance, levenshteinDistance } from "./utils";

const SCORE_THRESHOLDS = {
  title: { min: 50, max: 60, optimalScore: 10, suboptimalScore: 5 },
  metaDescription: { min: 120, max: 160, optimalScore: 10, suboptimalScore: 5 },
  keywords: {
    optimalDensity: 1,
    excessiveDensity: 2.5,
    optimalScore: 10,
    suboptimalScore: 5,
  },
  images: { optimalScore: 5, suboptimalScore: 2 },
  headings: { optimalScore: 5, suboptimalScore: 2 },
};

const calculateDeviationScore = (
  value: number,
  thresholds: {
    min: number;
    max: number;
    optimalScore: number;
    suboptimalScore: number;
  }
): { score: number; feedback: string } => {
  const deviation = Math.max(thresholds.min - value, value - thresholds.max, 0);
  return deviation > 0
    ? {
        score: thresholds.suboptimalScore,
        feedback: `Value is ${deviation} characters off optimal range.`,
      }
    : {
        score: thresholds.optimalScore,
        feedback: "Value is within the optimal range.",
      };
};

export const FEEDBACK_MESSAGES = {
  title: {
    positive: {
      optimalLength: "Title is within the optimal length. (50-60 characters)",
      optimalSemantic: "Title is well-optimized and relates to page content.",
    },
    negative: {
      length: "Title length should be between 50-60 characters for better SEO.",
      relevance:
        "Title does not reflect content topics well. Consider using relevant keywords and phrases from the content.",
      truncation:
        "Title may be truncated in search results. Aim for a concise and descriptive title.",
      missing:
        "No title found. Adding an SEO-friendly title can significantly improve your score.",
    },
  },
  metaDescription: {
    positive: {
      optimal: "Meta description is at an optimal length.",
    },
    negative: {
      length: "Meta description length should be between 120-160 characters.",
      keywords:
        "Meta description does not include primary keywords. Incorporate relevant keywords to improve visibility.",
      truncation:
        "Meta description may be truncated in search results. Keep it concise while still being descriptive.",
      missing:
        "No meta description found. Consider adding one that is SEO-friendly.",
    },
  },
  images: {
    positive: {
      correct: "All images have appropriate alt text, enhancing SEO.",
    },
    negative: {
      someImages:
        "Some images lack alt text. Ensure all images have alt text to improve SEO.",
      noImages:
        "No images present in the content. Consider adding relevant images to enhance user experience and SEO.",
      altText:
        "Descriptive alt text helps search engines understand image content and improves accessibility.",
    },
  },
  keywords: {
    positive: {
      optimal:
        "Keyword density is within the optimal range, enhancing SEO without risking penalty for stuffing.",
    },
    negative: {
      density:
        "Keyword density is too high, which may risk penalties for stuffing.",
      stuffing:
        "Excessive keyword density may be perceived as keyword stuffing. Focus on using keywords naturally and strategically.",
      underused:
        "Keywords are underused. Consider using them more frequently to improve SEO.",
      incorporation:
        "Low keyword density may affect SEO. Try to incorporate primary keywords more naturally throughout the content.",
      missing:
        "No keywords provided. Include relevant keywords to perform keyword analysis.",
    },
  },
  headings: {
    positive: {
      optimal: "Headings are well-structured and appropriately hierarchical.",
    },
    negative: {
      structure:
        "Headings should follow a logical hierarchy (H1 > H2 > H3). Improve heading structure for better SEO and readability.",
      keywords:
        "Headings do not include primary keywords. Incorporate relevant keywords in headings to improve SEO.",
      missing:
        "Headings are poorly structured. Using a proper heading structure can enhance SEO.",
    },
  },
};
// Evaluate the SEO score and feedback for the title
const evaluateTitle = (title: string, content: string): SEODetail => {
  // If the title is missing, return a score of 0 and appropriate feedback
  if (!title) {
    return {
      score: 0,
      maxScore: SCORE_THRESHOLDS.title.optimalScore,
      positiveFeedback: [],
      negativeFeedback: [FEEDBACK_MESSAGES.title.negative.missing],
    };
  }

  // Get the optimal score and suboptimal score thresholds for the title
  const { min, max, optimalScore, suboptimalScore } = SCORE_THRESHOLDS.title;

  // Calculate the score based on the length deviation from the optimal range
  const { score: lengthScore, feedback } = calculateDeviationScore(
    title.length,
    {
      min,
      max,
      optimalScore,
      suboptimalScore,
    }
  );

  // Calculate the semantic relevance of the title to the content
  const semanticRelevance = calculateSemanticRelevance(title, content);

  // Check if the title is semantically relevant based on a threshold
  const isSemanticRelevant = semanticRelevance > 0.8;

  // Assign a semantic score based on relevance
  const semanticScore = isSemanticRelevant ? optimalScore : suboptimalScore;

  // Calculate the weighted score combining length score and semantic score
  const weightedScore = lengthScore * 0.4 + semanticScore * 0.6;

  // Round the weighted score to get the final score
  const finalScore = Math.round(weightedScore);

  const positiveFeedback = [];
  const negativeFeedback = [];

  // Provide positive feedback if the title length is within the optimal range
  if (title.length >= min && title.length <= max)
    positiveFeedback.push(FEEDBACK_MESSAGES.title.positive.optimalLength);
  else negativeFeedback.push(FEEDBACK_MESSAGES.title.negative.length);

  // Provide positive feedback if the title is semantically relevant
  if (isSemanticRelevant)
    positiveFeedback.push(FEEDBACK_MESSAGES.title.positive.optimalSemantic);
  else negativeFeedback.push(FEEDBACK_MESSAGES.title.negative.relevance);

  // Provide negative feedback if the title length exceeds the maximum
  if (title.length > max)
    negativeFeedback.push(FEEDBACK_MESSAGES.title.negative.truncation);

  // Return the final score, maximum score, and feedback
  return {
    score: finalScore,
    maxScore: optimalScore,
    positiveFeedback,
    negativeFeedback,
  };
};

// Evaluate the SEO score and feedback for the meta description
const evaluateMetaDescription = (
  metaDescription: string,
  keywords: string[]
): SEODetail => {
  // If the meta description is missing, return a score of 0 and appropriate feedback
  if (!metaDescription) {
    return {
      score: 0,
      maxScore: SCORE_THRESHOLDS.metaDescription.optimalScore,
      positiveFeedback: [],
      negativeFeedback: [FEEDBACK_MESSAGES.metaDescription.negative.missing],
    };
  }

  // Get the optimal score and suboptimal score thresholds for the meta description
  const { min, max, optimalScore, suboptimalScore } =
    SCORE_THRESHOLDS.metaDescription;

  // Check if any of the provided keywords are present in the meta description
  const keywordPresence = keywords?.some((kw) => metaDescription.includes(kw));

  // Calculate the score based on the length deviation from the optimal range
  const { score, feedback } = calculateDeviationScore(metaDescription.length, {
    min,
    max,
    optimalScore,
    suboptimalScore,
  });

  // Provide positive feedback if keywords are present in the meta description
  const positiveFeedback = keywordPresence
    ? [FEEDBACK_MESSAGES.metaDescription.positive.optimal]
    : [];

  // Provide negative feedback if keywords are missing from the meta description
  const negativeFeedback = keywordPresence
    ? []
    : [FEEDBACK_MESSAGES.metaDescription.negative.keywords];

  // Provide negative feedback if the meta description length is outside the optimal range
  if (metaDescription.length < min || metaDescription.length > max)
    negativeFeedback.push(FEEDBACK_MESSAGES.metaDescription.negative.length);

  // Provide negative feedback if the meta description length exceeds the maximum
  if (metaDescription.length > max)
    negativeFeedback.push(
      FEEDBACK_MESSAGES.metaDescription.negative.truncation
    );

  // Return the score, maximum score, and feedback
  return { score, maxScore: optimalScore, positiveFeedback, negativeFeedback };
};

// Evaluate the SEO score and feedback for images
const evaluateImages = (images: { src: string; alt: string }[]): SEODetail => {
  // If there are no images, return a score of 0 and appropriate feedback
  if (!images.length) {
    return {
      score: 0,
      maxScore: SCORE_THRESHOLDS.images.optimalScore,
      positiveFeedback: [],
      negativeFeedback: [FEEDBACK_MESSAGES.images.negative.noImages],
    };
  }

  // Filter images that have alt text
  const imagesWithAltText = images.filter((img) => img.alt);

  // Calculate the score based on the proportion of images with alt text
  const score = Math.round(
    (imagesWithAltText.length / images.length) *
      SCORE_THRESHOLDS.images.optimalScore
  );

  // Provide positive feedback if all images have alt text
  const positiveFeedback =
    imagesWithAltText.length === images.length
      ? [FEEDBACK_MESSAGES.images.positive.correct]
      : [];

  // Provide negative feedback if some images lack alt text
  const negativeFeedback =
    imagesWithAltText.length === images.length
      ? []
      : [
          FEEDBACK_MESSAGES.images.negative.someImages,
          FEEDBACK_MESSAGES.images.negative.altText,
        ];

  // Return the score, maximum score, and feedback
  return {
    score,
    maxScore: SCORE_THRESHOLDS.images.optimalScore,
    positiveFeedback,
    negativeFeedback,
  };
};

// Evaluate the SEO score and feedback for headings
const evaluateHeadings = (
  headings: Record<string, string[]>,
  keywords: string[]
): SEODetail => {
  // Extract the heading levels and sort them
  const levels = Object.keys(headings)
    .map((level) => parseInt(level.replace("h", ""), 10))
    .sort();

  // Check if the headings follow a hierarchical structure
  const hierarchical = levels.every(
    (level, i, arr) => i === 0 || level <= arr[i - 1] + 1
  );

  // Check if any of the provided keywords are present in the headings
  const optimizedForKeywords = keywords?.some((keyword) =>
    Object.values(headings)
      .flat()
      .some((heading) => heading.toLowerCase().includes(keyword.toLowerCase()))
  );

  // Determine if the headings are optimal based on hierarchy and keyword optimization
  const isOptimal = hierarchical && optimizedForKeywords;

  // Assign a score based on whether the headings are optimal or suboptimal
  const score = isOptimal
    ? SCORE_THRESHOLDS.headings.optimalScore
    : SCORE_THRESHOLDS.headings.suboptimalScore;

  // Provide positive feedback if the headings are optimal
  const positiveFeedback = isOptimal
    ? [FEEDBACK_MESSAGES.headings.positive.optimal]
    : [];

  // Provide negative feedback if the headings are not optimal
  const negativeFeedback = isOptimal
    ? []
    : [FEEDBACK_MESSAGES.headings.negative.missing];

  // Provide negative feedback if the headings are not hierarchical
  if (!hierarchical)
    negativeFeedback.push(FEEDBACK_MESSAGES.headings.negative.structure);

  // Provide negative feedback if the headings are not optimized for keywords
  if (!optimizedForKeywords)
    negativeFeedback.push(FEEDBACK_MESSAGES.headings.negative.keywords);

  // Return the score, maximum score, and feedback
  return {
    score,
    maxScore: SCORE_THRESHOLDS.headings.optimalScore,
    positiveFeedback,
    negativeFeedback,
  };
};

// Evaluate the SEO score and feedback for keywords
const evaluateKeywords = (content: string, keywords: string[]): SEODetail => {
  // If there are no keywords provided, return a score of 0 and appropriate feedback
  if (!keywords || keywords.length === 0) {
    return {
      score: 0,
      maxScore: SCORE_THRESHOLDS.keywords.optimalScore,
      positiveFeedback: [],
      negativeFeedback: [FEEDBACK_MESSAGES.keywords.negative.missing],
    };
  }

  // Count the number of words in the content
  const contentWords = content.split(/\s+/).length;

  // Count the number of keyword instances in the content
  const keywordInstances = keywords.reduce(
    (acc, keyword) =>
      acc +
      (content.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length +
      content
        .split(" ")
        .reduce(
          (count, word) =>
            count + (levenshteinDistance(word, keyword) <= 2 ? 1 : 0),
          0
        ),
    0
  );

  // Calculate the keyword density as a percentage
  const keywordDensity = (keywordInstances / contentWords) * 100;

  let positiveFeedback = [],
    negativeFeedback = [],
    score;

  // Provide negative feedback and a suboptimal score if the keyword density is too high
  if (keywordDensity > SCORE_THRESHOLDS.keywords.excessiveDensity) {
    negativeFeedback = [
      FEEDBACK_MESSAGES.keywords.negative.density,
      FEEDBACK_MESSAGES.keywords.negative.stuffing,
    ];
    score = SCORE_THRESHOLDS.keywords.suboptimalScore;
  }
  // Provide positive feedback and an optimal score if the keyword density is within the optimal range
  else if (keywordDensity >= SCORE_THRESHOLDS.keywords.optimalDensity) {
    positiveFeedback = [FEEDBACK_MESSAGES.keywords.positive.optimal];
    score = SCORE_THRESHOLDS.keywords.optimalScore;
  }
  // Provide negative feedback and a suboptimal score if the keyword density is too low
  else {
    negativeFeedback = [
      FEEDBACK_MESSAGES.keywords.negative.underused,
      FEEDBACK_MESSAGES.keywords.negative.incorporation,
    ];
    score = SCORE_THRESHOLDS.keywords.suboptimalScore;
  }

  // Return the score, maximum score, and feedback
  return {
    score,
    maxScore: SCORE_THRESHOLDS.keywords.optimalScore,
    positiveFeedback,
    negativeFeedback,
  };
};

export const evaluateAll = (dataArray: SEOData[]): SEOFeedback[] =>
  dataArray.map((data) => {
    const keywordArray = data.keywords?.split(",").map((k) => k.trim());
    const details: SEODetails = {
      title: evaluateTitle(data.title, data.content),
      metaDescription: evaluateMetaDescription(
        data.metaDescription,
        keywordArray
      ),
      images: evaluateImages(data.images),
      headings: evaluateHeadings(data.headings, keywordArray),
      keywords: evaluateKeywords(data.content, keywordArray),
    };
    const scores = Object.values(details).map((detail) => detail.score);
    const maxScores = Object.values(details).map((detail) => detail.maxScore);

    return {
      score: scores.reduce((a, b) => a + b, 0),
      totalPossibleScore: maxScores.reduce((a, b) => a + b, 0),
      details,
      url: data.url,
      rawData: data,
    };
  });
