export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface Option {
  value: string;
  label: string;
  description?: string;
}

export type StepType = 'simple' | 'select' | 'multi-select' | 'url' | 'email' | 'social-links' | 'array';

export interface OnboardingStep {
  id: number;
  type: StepType;
  field: string;
  question: string;
  placeholder?: string;
  inputType?: "text" | "email" | "url" | "tel" | "number";
  options?: Option[];
  validate?: (value: any) => ValidationResult;
  skipInMode?: ('full-enrichment' | 'competitor-analysis')[];
}

export interface ThemeConfig {
  variant?: 'onboarding' | 'landing' | 'minimal';
  colors?: {
    primary?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    accent?: string;
  };
  animations?: {
    typingSpeed?: number;
    transitionDuration?: number;
  };
}

export type FormMode = 'full-enrichment' | 'competitor-analysis';

export interface FormFlowConfig {
  steps: OnboardingStep[];
  mode: FormMode;
  onComplete: (data: any) => Promise<void>;
  onAnalysisStart?: (url: string) => Promise<void>;
  onProgress?: (step: number, total: number) => void;
  streamHook?: any;
  theme?: ThemeConfig;
  initialData?: any;
  welcomeScreen?: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
}

export interface FormFlowState {
  currentStep: number;
  formData: any;
  isTyping: boolean;
  isProcessing: boolean;
  isFirstTransition: boolean;
}

export interface SocialLinks {
  twitter: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

export interface CompetitorData {
  name: string;
  url: string;
}

export interface BusinessFormData {
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  socialLinks: SocialLinks;
  goals: string[];
  competitors: CompetitorData[];
  keywords: string[];
}

// Question Processing Types
export interface PlaceholderConfig {
  key: string;
  value: string | number | undefined;
}

export interface QuestionProcessor {
  /**
   * Processes a question string by replacing placeholders with form data values
   * @param questionText - The raw question text containing placeholders in {key} format
   * @param formData - Object containing key-value pairs for placeholder replacement
   * @returns Processed question string with placeholders replaced
   */
  processQuestion: (questionText: string, formData: Record<string, any>) => string;
}

export type GetProcessedQuestionFunction = () => string;

export interface QuestionProcessingContext {
  currentConfig: OnboardingStep | null;
  formData: Record<string, any>;
  getProcessedQuestion: GetProcessedQuestionFunction;
}

export interface PlaceholderMatch {
  placeholder: string;
  key: string;
  replacement: string;
}

export interface QuestionProcessingOptions {
  /**
   * Whether to escape special regex characters in placeholders
   * @default true
   */
  escapeRegex?: boolean;
  /**
   * Fallback value when a placeholder key is not found in formData
   * @default ""
   */
  fallbackValue?: string;
  /**
   * Whether to preserve placeholders that don't have matching keys
   * @default false
   */
  preserveUnmatched?: boolean;
}

/**
 * Utility type for extracting placeholder keys from a question string
 * Example: ExtractPlaceholders<"Hello {name}, welcome to {company}!"> = "name" | "company"
 */
export type ExtractPlaceholders<T extends string> = 
  T extends `${string}{${infer Key}}${infer Rest}`
    ? Key | ExtractPlaceholders<Rest>
    : never;

/**
 * Type-safe question processing that ensures all placeholders have corresponding form data
 */
export interface TypedQuestionProcessor<TFormData extends Record<string, any>> {
  processQuestion: <TQuestion extends string>(
    questionText: TQuestion,
    formData: TFormData
  ) => string;
} 