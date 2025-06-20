import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, ArrowRight, Phone } from "lucide-react";
import { cn } from "@/utils/utils";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  metric?: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Intentified reduced our cost per lead by 73% while improving quality. We're reaching buyers we never knew existed.",
    author: "Sarah Chen",
    title: "VP of Marketing",
    company: "SaaS Company",
    metric: "73% reduction in cost per lead",
  },
  {
    quote:
      "The speed to lead is incredible. We're talking to prospects while our competitors are still waiting for form fills.",
    author: "Michael Rodriguez",
    title: "Director of Sales",
    company: "B2B Technology",
    metric: "48-hour lead response time",
  },
  {
    quote:
      "We've captured over 2,000 competitor visitors in just 3 months. It's like having a secret weapon in our marketing arsenal.",
    author: "Jennifer Park",
    title: "CMO",
    company: "Financial Services",
    metric: "2,000+ competitor visitors captured",
  },
  {
    quote:
      "Finally, a way to make our competitors work for us. The data quality is exceptional and the targeting is laser-focused.",
    author: "David Thompson",
    title: "Head of Growth",
    company: "E-commerce Platform",
    metric: "5x improvement in lead quality",
  },
  {
    quote:
      "ROI was immediate. We're now converting prospects that would have gone to our biggest competitor instead.",
    author: "Lisa Wang",
    title: "Marketing Director",
    company: "Professional Services",
    metric: "Immediate positive ROI",
  },
];

const clients = [
  { name: "TechCorp", logo: "/logos/techcorp.svg" },
  { name: "InnovateSaaS", logo: "/logos/innovate.svg" },
  { name: "GrowthFlow", logo: "/logos/growthflow.svg" },
  { name: "DataDriven Inc", logo: "/logos/datadriven.svg" },
  { name: "ScaleUp Partners", logo: "/logos/scaleup.svg" },
  { name: "NextGen Solutions", logo: "/logos/nextgen.svg" },
];
const images = [
  { name: "TechCorp", src: "/logos/techcorp.svg" },
  { name: "InnovateSaaS", src: "/logos/innovate.svg" },
  { name: "GrowthFlow", src: "/logos/growthflow.svg" },
];
const trustLogos = [
  { name: "TechCorp", logo: "/logos/techcorp.svg" },
  { name: "InnovateSaaS", logo: "/logos/innovate.svg" },
  { name: "GrowthFlow", logo: "/logos/growthflow.svg" },
  { name: "DataDriven Inc", logo: "/logos/datadriven.svg" },
  { name: "ScaleUp Partners", logo: "/logos/scaleup.svg" },
  { name: "NextGen Solutions", logo: "/logos/nextgen.svg" },
  { name: "3Rhino", logo: "/logos/3rhino-logo.svg" },
  { name: "Best Buy", logo: "/logos/bestbuy-logo.svg" },
  { name: "DavisCo", logo: "/logos/davisco-logo.svg" },
  { name: "NYU", logo: "/logos/nyu-logo.svg" },
  { name: "PBS", logo: "/logos/pbs-logo.svg" },
  { name: "Seidio", logo: "/logos/seidio-logo.svg" },
  { name: "Target", logo: "/logos/target-logo.svg" },
];
export const CustomerTestimonials: FC = () => {
  return (
    <section className="bg-muted/50 w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Real Results from Real Customers
          </h2>
          <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            See how businesses across industries are using Intentified to
            capture competitor traffic and convert it into revenue.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-background border-border relative transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <Quote className="text-primary mb-4 h-8 w-8 opacity-50" />
                <blockquote className="mb-4 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {testimonial.metric && (
                  <div className="bg-primary/10 border-primary mb-4 rounded-lg border-l-4 p-3">
                    <p className="text-primary text-sm font-semibold">
                      Key Result: {testimonial.metric}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="text-primary text-sm font-semibold">
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">
                      {testimonial.author}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-sm">
            Trusted by companies across industries
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-50 grayscale">
            {trustLogos.map((logo, index) => (
              <div
                key={index}
                className="text-muted-foreground text-xs font-medium"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>

        {/* Primary Conversion Section */}
        <div className="mt-24">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center md:p-12">
              <h3 className="mb-4 text-3xl font-bold">
                Ready to Capture "Mid-Funnel" Leads in Real-Time?
              </h3>
              <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-lg">
                Help us target your ideal customers. We need:
              </p>

              <div className="mx-auto mb-8 grid max-w-4xl grid-cols-1 gap-8 text-left md:grid-cols-2">
                <div className="bg-background rounded-lg p-6">
                  <h4 className="mb-3 text-lg font-bold">
                    Your Competitors (5 examples)
                  </h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Main websites (e.g., ford.com)</li>
                    <li>• Product pages (e.g., ford.com/f150)</li>
                    <li>• Pricing pages</li>
                  </ul>
                </div>

                <div className="bg-background rounded-lg p-6">
                  <h4 className="mb-3 text-lg font-bold">
                    Your Target Actions
                  </h4>
                  <ul className="text-muted-foreground space-y-2">
                    <li>• Demo request pages</li>
                    <li>• Pricing pages</li>
                    <li>• Sign-up forms</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  Start Free Intent Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Schedule Strategy Call
                  <Phone className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="mb-2 text-2xl font-bold">
            Stop Wasting Money on Cold Traffic
          </h3>
          <h4 className="text-primary mb-6 text-xl font-semibold">
            Start Converting Competitor Visitors Today
          </h4>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg"
          >
            Get Your Free Intent Analysis
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          <div className="mt-6 space-y-2">
            <p className="text-muted-foreground">
              Or call us:{" "}
              <span className="text-foreground font-semibold">
                612-578-5104
              </span>
            </p>
            <p className="text-muted-foreground text-sm italic">
              Intentified | Making Intent Data Actually Work
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
