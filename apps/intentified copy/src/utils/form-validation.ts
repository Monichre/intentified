/**
 * Form Validation Utility
 *
 * Provides validation functions for form fields with consistent return format.
 * Each function returns an object with isValid boolean and optional error message.
 */

export type ValidationResult = {
  isValid: boolean
  errorMessage?: string
}

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, errorMessage: "Name is required" }
  }

  if (name.trim().length < 2) {
    return { isValid: false, errorMessage: "Name must be at least 2 characters" }
  }

  return { isValid: true }
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, errorMessage: "Email is required" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: "Please enter a valid email address" }
  }

  return { isValid: true }
}

export const validateCompany = (company: string): ValidationResult => {
  if (!company.trim()) {
    return { isValid: false, errorMessage: "Company name is required" }
  }

  return { isValid: true }
}

export const validateDetails = (details: string): ValidationResult => {
  if (!details.trim()) {
    return { isValid: false, errorMessage: "Please provide some details" }
  }

  if (details.trim().length < 10) {
    return { isValid: false, errorMessage: "Please provide more details (at least 10 characters)" }
  }

  return { isValid: true }
}
