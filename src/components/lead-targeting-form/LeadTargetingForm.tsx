import type React from "react";
import { useState, type FormEvent } from "react";
import "./lead-targeting-form.css";

/**
 * LeadTargetingForm
 * Multi-section form for collecting lead targeting URLs in four intent categories.
 * Uses Tailwind CSS for layout and styling, with a separate CSS file for custom styles.
 * Validates required fields before submission.
 */

const FIELD_COUNT = 10;
const REQUIRED_COUNT = 5;

const INTENT_CATEGORIES = [
  {
    key: "competitor",
    title: "1. Competitor Intent",
    description: `Please provide a list of 5–10 competitors' URLs. The first five must be main website URLs. URLs 6–10 must be subpages that specifically target a service or product closely aligned with your offerings for more focused targeting.`,
    example:
      "Example: Main URL: https://www.ford.com | Subpage URL: https://www.ford.com/f150",
    labelPrefix: "Competitor URL",
    inputNamePrefix: "Competitor_URL_",
  },
  {
    key: "social",
    title: "2. Social Intent",
    description:
      "Please provide a list of 5–10 social media URLs relevant to your ideal buyer category. The first five must be main social media platform URLs (e.g., main pages or channels). URLs 6–10 must be subpages or specific content URLs.",
    example:
      "Example: Main URL: https://www.facebook.com/Ford | Subpage URL: https://www.facebook.com/Ford/posts/12345",
    labelPrefix: "Social Media URL",
    inputNamePrefix: "Social_URL_",
  },
  {
    key: "keyword",
    title: "3. Keyword Intent",
    description:
      "Please provide a list of 5–10 URLs related to your service or product, derived from keyword or search phrase research. The first five must be main website URLs relevant to your keywords. URLs 6–10 must be subpages tied to specific products, services, or content.",
    example:
      'Example: Main URL: https://www.ford.com | Subpage URL: https://www.ford.com/trucks/f150 | Keyword: "used ford F150 near Minneapolis"',
    labelPrefix: "Keyword/Search Phrase URL",
    inputNamePrefix: "Keyword_URL_",
  },
  {
    key: "website",
    title: "4. Website Intent",
    description:
      "Please provide your website URLs to enable retargeting of visitors who do not self-identify or fill out forms. The first five must be your main website URLs. URLs 6–10 must be subpages.",
    example:
      "Example: Main URL: https://yourcompany.com | Subpage URL: https://yourcompany.com/products",
    labelPrefix: "Website URL",
    inputNamePrefix: "Website_URL_",
  },
];

/**
 * Renders a section of the form for a given intent category.
 */
function renderIntentSection({
  key,
  title,
  description,
  example,
  labelPrefix,
  inputNamePrefix,
}: (typeof INTENT_CATEGORIES)[number]) {
  return (
    <section key={key}>
      <h3 className="text-foreground text-md mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
      <p className="text-muted-foreground text-sm italic">{example}</p>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: FIELD_COUNT }).map((_, i) => (
          <div key={`${key}-${i + 1}`} className="mt-4">
            <label
              htmlFor={`${key}${i + 1}`}
              data-required={i < REQUIRED_COUNT ? "*" : ""}
              className="text-muted-foreground text-sm"
            >
              {labelPrefix} {i + 1}{" "}
              {i < REQUIRED_COUNT ? "(Main URL)" : "(Subpage URL, optional)"}
            </label>
            <input
              type="text"
              id={`${key}${i + 1}`}
              name={`${inputNamePrefix}${i + 1}`}
              required={i < REQUIRED_COUNT}
              placeholder={
                i < REQUIRED_COUNT
                  ? "https://example.com"
                  : "https://example.com/page (optional)"
              }
              autoComplete="off"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * LeadTargetingForm component
 */
export const LeadTargetingForm: React.FC = () => {
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    const requiredFields = form.querySelectorAll("input[required]");
    let valid = true;

    for (const field of requiredFields) {
      if (!(field as HTMLInputElement).value.trim()) valid = false;
    }

    if (!valid) {
      e.preventDefault();
      setHasError(true);
      // Scroll to the first error
      const firstInvalidField = form.querySelector(
        "input[required]:invalid",
      ) as HTMLElement;
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
    } else {
      setHasError(false);
      // Let the form submit (mailto:)
    }
  };

  return (
    <main className="mx-auto h-full w-full overflow-y-auto">
      <div className="mb-6 text-center">
        <h1 className="text-foreground mb-4 text-3xl leading-tight font-bold tracking-tight">
          Thank you for choosing Intentified.com
        </h1>
        <div className="bg-primary mx-auto mb-6 h-1 w-20 rounded-full" />
      </div>

      <div className="bg-card/50 mb-8 rounded-lg p-6">
        <h2 className="text-foreground text-md mb-4">
          How Intent Data Targeting Works for Fast Sales Leads
        </h2>
        <p className="text-muted-foreground text-sm">
          Intent data targeting accelerates sales by identifying prospects
          actively researching products or services like yours. By analyzing
          online behaviors—such as visits to competitor websites, engagement
          with relevant social media, or searches for specific keywords—we
          pinpoint high-intent leads ready to buy. This data-driven approach
          ensures your marketing efforts focus on prospects most likely to
          convert, delivering faster, more qualified sales leads to your team.
        </p>
        <div className="border-primary bg-muted/30 mt-6 rounded-r-md border-l-4 p-4">
          <p className="text-foreground text-sm">
            To help us effectively target your ideal leads, please provide the
            following information in the categories listed below. We request
            lists for four intent data categories to ensure precise lead
            targeting. For each section, the first five URLs must be main
            website URLs (e.g., www.ford.com), and URLs 6–10 must be subpage
            URLs (e.g., www.ford.com/f150). Kindly complete and submit this
            form.
          </p>
        </div>
      </div>

      {hasError && (
        <div id="formError" role="alert">
          Please fill out all required fields marked with an asterisk (*).
        </div>
      )}

      <form
        id="leadTargetingForm"
        action="mailto:bob@Intentified.com"
        method="post"
        encType="text/plain"
        onSubmit={handleSubmit}
        noValidate
      >
        {INTENT_CATEGORIES.map(renderIntentSection)}

        {/* <div className="bg-accent/20 mt-8 mb-6 rounded-md p-4">
          <h3 className="text-foreground text-md mb-2">
            Submission Instructions
          </h3>
          <p className="text-muted-foreground">
            Please fill out the required fields above and submit the form. If
            you have any questions, feel free to contact us at{" "}
            <a href="mailto:bob@Intentified.com">bob@Intentified.com</a>.
          </p>
        </div> */}

        <div className="mt-8 flex justify-center">
          <input type="submit" value="Submit Form" />
        </div>
      </form>

      <p className="text-muted-foreground mt-8 text-center font-medium">
        Thank you for your cooperation in helping us optimize your lead
        targeting strategy!
      </p>
    </main>
  );
};
