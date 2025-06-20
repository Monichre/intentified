"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Globe, AlertCircle, CheckCircle } from "lucide-react";

const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
const urlSchema = z.string().regex(urlPattern, { message: "Please enter a valid URL" });

interface WebsiteUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  onValidUrl?: (url: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function WebsiteUrlInput({
  value,
  onChange,
  onValidUrl,
  placeholder = "https://example.com",
  disabled = false,
}: WebsiteUrlInputProps) {
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserHasInteracted(true);
    let inputVal = event.target.value.trim();

    // Ensure the input always starts with 'https://' if user is typing
    if (inputVal && !inputVal.startsWith("http://") && !inputVal.startsWith("https://")) {
      inputVal = "https://" + inputVal;
    }

    onChange(inputVal);
  };

  // Validate URL whenever value changes
  useEffect(() => {
    if (userHasInteracted && value && value !== "https://") {
      const result = urlSchema.safeParse(value);
      setIsValid(result.success);
      setErrorMessage(result.success ? "" : "Please enter a valid URL");
      
      if (result.success && onValidUrl) {
        onValidUrl(value);
      }
    } else {
      setIsValid(true);
      setErrorMessage("");
    }
  }, [value, userHasInteracted, onValidUrl]);

  const showError = userHasInteracted && !isValid && value && value !== "https://";
  const showSuccess = userHasInteracted && isValid && value && value !== "https://";

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Globe className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          type="url"
          className={`
            w-full pl-10 pr-10 py-2 border rounded-md
            ${showError ? 'border-red-500 focus:ring-red-500' : ''}
            ${showSuccess ? 'border-green-500 focus:ring-green-500' : ''}
            ${!showError && !showSuccess ? 'border-input focus:ring-ring' : ''}
            bg-background text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
          `}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {showError && <AlertCircle className="h-4 w-4 text-red-500" />}
          {showSuccess && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>
      {showError && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}