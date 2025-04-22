"use client";

// External imports
import { QuoteIcon } from "lucide-react";

// Internal imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

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
 * TestimonialCard component for displaying individual customer testimonial
 */
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: any;
  index: number;
}) => {
  return (
    <Card
      key={index}
      className="border-border/50 bg-background/60 hover:border-primary/20 group overflow-hidden rounded-xl border p-1 transition-all duration-300 hover:shadow-lg"
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div
              className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full transition-all"
              aria-hidden="true"
            >
              <QuoteIcon className="text-primary h-6 w-6" />
            </div>
            <div className="text-muted-foreground text-right text-sm tracking-wide italic">
              Client Testimonial
            </div>
          </div>

          <p className="text-foreground text-lg">
            <span aria-hidden="true">&ldquo;</span>
            <span>{testimonial.quote}</span>
            <span aria-hidden="true">&ldquo;</span>
          </p>

          <div className="flex items-center gap-4 border-t pt-5">
            <Avatar className="border-border/50 h-12 w-12 border-2">
              <AvatarImage
                src={testimonial.avatar}
                alt={`${testimonial.author}'s avatar`}
              />
              <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                {testimonial.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold tracking-tight">
                {testimonial.author}
              </div>
              <div className="text-muted-foreground text-sm">
                {testimonial.role}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Testimonial data from customers
 */
const testimonials = [
  {
    quote:
      "This platform has transformed how we manage customer relationships. The AI features are a game-changer for our team's productivity.",
    author: "Sarah Chen",
    role: "Head of Sales, TechCorp",
    avatar: "/avatars/avatar.png",
  },
  {
    quote:
      "The automation capabilities have saved us countless hours. Our customer satisfaction scores have improved significantly.",
    author: "Michael Rodriguez",
    role: "Customer Success Manager, GrowthX",
    avatar: "/avatars/avatar.png",
  },
  {
    quote:
      "The analytics insights helped us identify key opportunities we were missing. Our revenue has grown 40% since implementing.",
    author: "Emma Thompson",
    role: "VP of Operations, ScaleUp Inc",
    avatar: "/avatars/avatar.png",
  },
];

/**
 * Main Testimonials component
 */
export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative"
      aria-labelledby="testimonials-heading"
    >
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden="true"
      ></div>
      <div
        className="bg-primary/20 absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <SectionTitle
          title="Trusted by Teams Worldwide"
          subtitle="See what our customers are saying about their experience with our platform."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
