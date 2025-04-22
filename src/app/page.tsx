/**
 * Home Page Component
 */

"use client";

// Internal imports from feature components
import { CTA } from "@/features/landing/cta";
import { Features } from "@/features/landing/features";
import { Footer } from "@/features/landing/footer";
import { Header } from "@/features/landing/header";
import { Hero } from "@/features/landing/hero";
import { Pricing } from "@/features/landing/pricing";
import { Testimonials } from "@/features/landing/testimonials";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
