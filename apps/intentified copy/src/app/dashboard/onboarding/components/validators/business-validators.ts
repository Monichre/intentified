/**
 * Business Onboarding Validation Utilities
 *
 * Validation functions for business-specific form fields with consistent return format.
 * Each function returns an object with isValid boolean and optional error message.
 */

export type ValidationResult = {
  isValid: boolean
  errorMessage?: string
}

// Basic field validators
export const validateCompanyName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, errorMessage: "Company name is required" }
  }

  if (name.trim().length < 2) {
    return { isValid: false, errorMessage: "Company name must be at least 2 characters" }
  }

  return { isValid: true }
}

export const validateCompanySize = (size: string): ValidationResult => {
  const validSizes = ["1-10", "11-50", "51-200", "201-500", "501+"]
  
  if (!size) {
    return { isValid: false, errorMessage: "Please select a company size" }
  }

  if (!validSizes.includes(size)) {
    return { isValid: false, errorMessage: "Please select a valid company size" }
  }

  return { isValid: true }
}

export const validateIndustry = (industry: string): ValidationResult => {
  const validIndustries = [
    "technology", "ecommerce", "healthcare", "finance", 
    "education", "manufacturing", "retail", "other"
  ]
  
  if (!industry) {
    return { isValid: false, errorMessage: "Please select an industry" }
  }

  if (!validIndustries.includes(industry)) {
    return { isValid: false, errorMessage: "Please select a valid industry" }
  }

  return { isValid: true }
}

export const validateWebsite = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, errorMessage: "Website URL is required" }
  }

  // Basic URL validation
  const urlPattern = /^https?:\/\/.+\..+/
  if (!urlPattern.test(url)) {
    return { isValid: false, errorMessage: "Please enter a valid website URL (e.g., https://example.com)" }
  }

  return { isValid: true }
}

export const validateSocialUrl = (url: string): ValidationResult => {
  // Social URLs are optional, so empty is valid
  if (!url.trim()) {
    return { isValid: true }
  }

  // Basic URL validation for social links
  const urlPattern = /^https?:\/\/.+/
  if (!urlPattern.test(url)) {
    return { isValid: false, errorMessage: "Please enter a valid URL (e.g., https://twitter.com/yourcompany)" }
  }

  return { isValid: true }
}

export const validateGoals = (goals: string[]): ValidationResult => {
  if (!goals || goals.length === 0) {
    return { isValid: false, errorMessage: "Please select at least one goal" }
  }

  const validGoals = ["1", "2", "3", "4"]
  const invalidGoals = goals.filter(goal => !validGoals.includes(goal))
  
  if (invalidGoals.length > 0) {
    return { isValid: false, errorMessage: "Some selected goals are invalid" }
  }

  return { isValid: true }
}

export const validateCompetitorName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, errorMessage: "Competitor name is required" }
  }

  if (name.trim().length < 2) {
    return { isValid: false, errorMessage: "Competitor name must be at least 2 characters" }
  }

  return { isValid: true }
}

export const validateCompetitorUrl = (url: string): ValidationResult => {
  // Competitor URL is optional
  if (!url.trim()) {
    return { isValid: true }
  }

  const urlPattern = /^https?:\/\/.+\..+/
  if (!urlPattern.test(url)) {
    return { isValid: false, errorMessage: "Please enter a valid website URL" }
  }

  return { isValid: true }
}

export const validateKeyword = (keyword: string): ValidationResult => {
  if (!keyword.trim()) {
    return { isValid: false, errorMessage: "Keyword cannot be empty" }
  }

  if (keyword.trim().length < 2) {
    return { isValid: false, errorMessage: "Keyword must be at least 2 characters" }
  }

  return { isValid: true }
}

export const validateKeywords = (keywords: string[]): ValidationResult => {
  const nonEmptyKeywords = keywords.filter(kw => kw.trim())
  
  if (nonEmptyKeywords.length === 0) {
    return { isValid: false, errorMessage: "Please provide at least one keyword" }
  }

  // Validate each keyword
  for (const keyword of nonEmptyKeywords) {
    const result = validateKeyword(keyword)
    if (!result.isValid) {
      return result
    }
  }

  return { isValid: true }
}

// Multi-step validation helpers
export const validateStep = (step: number, value: any): ValidationResult => {
  switch (step) {
    case 1: // Company name
      return validateCompanyName(value)
    case 2: // Company size
      return validateCompanySize(value)
    case 3: // Industry
      return validateIndustry(value)
    case 4: // Website
      return validateWebsite(value)
    case 5: // Goals (handled separately as multi-select)
      return { isValid: true } // Will be validated when submitted
    default:
      return { isValid: true }
  }
}