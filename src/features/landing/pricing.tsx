"use client";

// External imports
import { Check, Sparkles, ArrowRight } from "lucide-react";

// Internal imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * SectionTitle component for consistent headings across sections
 */
const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="text-3xl font-bold tracking-tight uppercase sm:text-4xl">
        <span className="relative">{title}</span>
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl text-center text-lg">
        {subtitle}
      </p>
    </div>
  );
};

/**
 * PricingCard component for displaying individual pricing tier
 */
const PricingCard = ({ tier, index }: { tier: any; index: number }) => {
  return (
    <Card
      key={index}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden border transition-all duration-300 hover:shadow-lg",
        tier.popular
          ? "border-primary shadow-md"
          : "border-border/50 hover:border-primary/20",
      )}
    >
      {tier.popular && (
        <div
          className="absolute -top-10 -right-10 overflow-hidden"
          aria-label="Popular plan"
        >
          <div className="bg-primary flex h-32 w-32 translate-x-2 -translate-y-2 rotate-45 items-center justify-center">
            <span className="text-primary-foreground mt-16 text-sm font-semibold">
              Popular
            </span>
          </div>
        </div>
      )}
      <CardHeader className={cn("p-6", tier.popular ? "bg-primary/5" : "")}>
        <CardTitle>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {tier.popular && (
                <Sparkles className="text-primary h-5 w-5" aria-hidden="true" />
              )}
              <h3 className="text-xl font-bold tracking-tight">{tier.name}</h3>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold">{tier.price}</span>
              {tier.price !== "Custom" && (
                <span className="text-muted-foreground text-sm">/month</span>
              )}
            </div>
          </div>
        </CardTitle>
        <p className="text-muted-foreground mt-2">{tier.description}</p>
      </CardHeader>
      <CardContent className="flex-1 p-6 pt-0">
        <ul className="space-y-3" aria-label={`Features for ${tier.name} plan`}>
          {tier.features.map((feature: string, j: number) => (
            <li key={j} className="flex items-center gap-2.5">
              <div
                className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded-full"
                aria-hidden="true"
              >
                <Check className="text-primary h-3 w-3" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          className={cn(
            "h-12 w-full font-semibold tracking-wide",
            tier.name === "Enterprise" ? "gap-2" : "",
          )}
          size="lg"
          variant={tier.popular ? "default" : "outline"}
        >
          {tier.cta}
          {tier.name === "Enterprise" && (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * Pricing tiers data with plan details
 */
const tiers = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small teams just getting started",
    features: [
      "Up to 5 team members",
      "Basic email automation",
      "Customer data insights",
      "Standard support",
      "1GB storage",
    ],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    description: "Ideal for growing businesses",
    features: [
      "Up to 20 team members",
      "Advanced automation workflows",
      "AI-powered insights",
      "Priority support",
      "10GB storage",
      "Custom integrations",
      "API access",
    ],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with specific needs",
    features: [
      "Unlimited team members",
      "Custom automation workflows",
      "Advanced AI capabilities",
      "24/7 dedicated support",
      "Unlimited storage",
      "Custom development",
      "SLA guarantee",
      "On-premise deployment",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

/**
 * Main Pricing component
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative"
      aria-labelledby="pricing-heading"
    >
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden="true"
      ></div>
      <div
        className="bg-primary/20 absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <SectionTitle
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that best fits your needs. All plans include a 14-day free trial with no credit card required."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <PricingCard key={i} tier={tier} index={i} />
          ))}
        </div>

        {/* Custom plan section */}
        <div className="border-border/50 bg-background/50 mt-24 rounded-xl border p-8 text-center">
          <h3 className="text-2xl font-bold tracking-tight" id="custom-plan">
            Need a Custom Plan?
          </h3>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg">
            Contact our sales team for a tailored solution that meets your
            specific requirements.
          </p>
          <Button
            className="mt-8 h-14 px-8 font-semibold tracking-wide"
            size="lg"
            variant="outline"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
