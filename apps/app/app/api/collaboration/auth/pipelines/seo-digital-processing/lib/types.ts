/* _______________OG IMAGES________________ */
export interface OpenGraph {
  title: string;
  description: string;
  url: string;
  siteName: string;
  image: string;
  type: string;
}

export interface TwitterCard {
  card: string;
  site: string;
  creator: string;
  title: string;
  description: string;
  image: string;
}

interface Image {
  src: string;
  alt: string;
}

interface Link {
  text: string;
  href: string;
}

/* _______________Web Vitals________________ */

export interface CrUXApiResponse {
  record: {
    key: {
      url: string;
    };
    metrics: Metrics;
  };
}

export interface WebVitals {
  first_input_delay: Metric;
  interaction_to_next_paint: Metric;
  largest_contentful_paint: Metric;
  cumulative_layout_shift: Metric;
  experimental_time_to_first_byte: Metric;
  first_contentful_paint: Metric;
}

interface Metric {
  histogram: HistogramEntry[];
  percentiles: { p75: number | string };
}

interface HistogramEntry {
  start: number | string;
  end?: number | string;
  density?: number;
}

export interface CoreVitalsAssessment {
  largest_contentful_paint: VitalsAssessment;
  first_input_delay: VitalsAssessment;
  cumulative_layout_shift: VitalsAssessment;
}

interface VitalsAssessment {
  percentile75: number | string;
  threshold: number | string;
  passes: boolean;
}

export interface CollectionPeriod {
  firstDate: DateDetails;
  lastDate: DateDetails;
}

interface DateDetails {
  year: number;
  month: number;
  day: number;
}

export interface Metrics {
  [key: string]: {
    histogram: {
      start: number | string;
      end?: number | string;
      density: number;
    }[];
    percentiles: {
      p75: number | string;
    };
  };
}

/* _______________SEO_______________ */

export interface SEOData {
  url: string;
  title: string;
  metaDescription: string;
  keywords: string;
  robots: string;
  canonical: string | null;
  openGraph: OpenGraph;
  twitterCard: TwitterCard;
  headings: Record<string, string[]>;
  images: Image[];
  links: Link[];
  content: string;
}

export interface SEOConfig {
  titleLengthScoreThresholds: {
    min: number;
    max: number;
    optimalScore: number;
    suboptimalScore: number;
  };
  metaDescriptionLengthScoreThresholds: {
    min: number;
    max: number;
    optimalScore: number;
    suboptimalScore: number;
  };
  keywordCountThresholds: {
    min: number;
    max: number;
    optimalScore: number;
    suboptimalScore: number;
  };
}

export interface SEORules {
  [key: string]: RuleDetails;
}

export interface RuleDetails {
  score: number;
  thresholds?: {
    min: number;
    max: number;
    optimalScore: number;
    suboptimalScore: number;
  };
  altTextRequired?: boolean;
  required?: boolean;
  feedback: {
    [key: string]: string;
  };
}

export interface SEODetail {
  score: number;
  maxScore: number;
  negativeFeedback: string[];
  positiveFeedback: string[];
}

export interface SEODetails {
  title: SEODetail;
  metaDescription: SEODetail;
  images: SEODetail;
  headings: SEODetail;
  //   rawData: SEOData;
  keywords: SEODetail;
}

export interface SEOFeedback {
  score: number;
  totalPossibleScore: number;
  details: SEODetails;
  url: string;
  rawData: any;
}

// Combined Form Payload
export interface ScrapeFormState {
  allSeoData: SEOData[];
  rawWebVitals: {
    record: {
      key: {
        url: string;
      };
      metrics: WebVitals;
      collectionPeriod: CollectionPeriod;
    };
  } | null;
  coreVitalsAssessment: CoreVitalsAssessment | null;
}
