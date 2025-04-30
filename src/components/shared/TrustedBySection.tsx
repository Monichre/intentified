import React from "react";

/**
 * TrustedBySection displays a list of trusted industry leaders.
 *
 * @remarks
 * This is a stateless, presentational component for the landing page hero section.
 *
 * @returns {JSX.Element} The trusted by section markup
 */
export function TrustedBySection(): JSX.Element {
  return (
    <div className="mt-16 text-center">
      <p className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
        Trusted by Industry Leaders
      </p>
      <p className="text-foreground mt-4 text-lg font-medium">
        Target · BestBuy · Seidio · Davisco Foods International
      </p>
    </div>
  );
}
