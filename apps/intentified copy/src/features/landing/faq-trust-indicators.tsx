"use client";
import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Award,
  Lock,
  Users,
  CheckCircle,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/utils/utils";

interface FAQItem {
  question: string;
  answer: string;
  prominent?: boolean;
}

const faqItems: FAQItem[] = [
  {
    question: "Is this really legal?",
    answer:
      "Yes, 100%. We only use publicly available data and comply with all privacy regulations including GDPR and CCPA. No hacking, no stolen data—just smart technology that analyzes publicly accessible information to identify website visitors.",
    prominent: true,
  },
  {
    question: "How fast can we start?",
    answer:
      "Most clients see first leads within 48 hours of setup. Full optimization takes 2-3 weeks as we fine-tune targeting based on your specific industry and competitor landscape.",
  },
  {
    question: "What makes you different from other intent data providers?",
    answer:
      "Scale (1.9T signals), speed (real-time), and execution (we send the emails, not just provide data). Unlike other providers who give you lists to work with, we handle the entire process from identification to outreach.",
  },
  {
    question: "What's the minimum budget?",
    answer:
      "We work with businesses spending $5,000+/month on marketing who want better ROI. Our platform is designed for companies serious about scaling their lead generation efforts.",
  },
  {
    question: "How do you identify website visitors?",
    answer:
      "Our identity resolution technology matches anonymous visitors to our database of 270 million verified US consumers using multiple data points including IP addresses, device fingerprinting, and behavioral patterns—all while maintaining privacy compliance.",
  },
  {
    question: "What industries do you work with?",
    answer:
      "We specialize in B2B technology, professional services, e-commerce, and financial services, but our platform works for any business with identifiable competitors and a clear target audience.",
  },
  {
    question: "Do I need to change my website or tracking?",
    answer:
      "No. Our system operates independently of your website. We only need to know your competitors and target actions. There's no code to install or tracking pixels to manage.",
  },
  {
    question: "How is this different from retargeting?",
    answer:
      "Retargeting only reaches people who have already visited your site. We capture prospects who have never visited you but are actively shopping your competitors—expanding your addressable market significantly.",
  },
  {
    question: "What kind of data do you provide?",
    answer:
      "We provide verified contact information including email addresses, phone numbers, company details, and behavioral intent signals. All data is permission-based and compliant with anti-spam regulations.",
  },
  {
    question: "How do you ensure data quality?",
    answer:
      "Our data goes through multiple verification layers including real-time validation, bounce detection, and engagement scoring. We maintain a 95%+ deliverability rate across all campaigns.",
  },
  {
    question: "Can I integrate with my existing CRM?",
    answer:
      "Yes, we integrate with all major CRMs including Salesforce, HubSpot, Pipedrive, and others. We can also provide data via API or automated exports to fit your existing workflow.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "Every client gets a dedicated account manager, technical support team, and access to our strategy consultants. We're invested in your success and provide ongoing optimization recommendations.",
  },
];

const trustIndicators = [
  {
    icon: Shield,
    title: "GDPR & CCPA Compliant",
    description: "Full compliance with global privacy regulations",
  },
  {
    icon: Lock,
    title: "SOC 2 Certified",
    description: "Enterprise-grade security standards",
  },
  {
    icon: Award,
    title: "Inc. 5000 Partner",
    description: "Trusted by fastest-growing companies",
  },
  {
    icon: Users,
    title: "270M+ Profiles",
    description: "Largest verified B2B database",
  },
  {
    icon: CheckCircle,
    title: "99.9% Uptime SLA",
    description: "Enterprise reliability guarantee",
  },
];

export const FAQTrustIndicators: FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section className="bg-background w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Everything you need to know about Intentified's platform, process,
            and compliance.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {trustIndicators.map((indicator, index) => (
              <Card
                key={index}
                className="bg-muted/30 border-border/50 text-center"
              >
                <CardContent className="p-6">
                  <indicator.icon className="text-primary mx-auto mb-3 h-8 w-8" />
                  <h3 className="mb-1 text-sm font-semibold">
                    {indicator.title}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {indicator.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  "transition-all duration-200 hover:shadow-md",
                  item.prominent && "border-primary/30 bg-primary/5",
                  openItems.includes(index) && "shadow-md",
                )}
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleItem(index)}
                >
                  <CardTitle className="flex items-center justify-between text-left">
                    <span
                      className={cn(
                        "text-lg font-semibold",
                        item.prominent && "text-primary",
                      )}
                    >
                      {item.question}
                    </span>
                    {openItems.includes(index) ? (
                      <ChevronUp className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>

                {openItems.includes(index) && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-12 text-center">
            <Card className="bg-muted/30 border-border/50">
              <CardContent className="p-8">
                <h3 className="mb-4 text-xl font-semibold">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our team is here to help you understand how Intentified can
                  work for your business.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button variant="outline" className="px-6 py-2">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                  </Button>
                  <Button className="px-6 py-2">
                    {/* <Phone className="mr-2 h-4 w-4" /> */}
                    Schedule a Call
                  </Button>
                </div>

                <div className="border-border/50 mt-6 border-t pt-6">
                  <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-xs">
                    <a
                      href="/privacy"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </a>
                    <a
                      href="/security"
                      className="hover:text-foreground transition-colors"
                    >
                      Security Practices
                    </a>
                    <a
                      href="/compliance"
                      className="hover:text-foreground transition-colors"
                    >
                      Compliance Center
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Privacy Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Industry Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQTrustIndicators;
