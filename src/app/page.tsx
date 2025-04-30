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
import { Clients } from "@/features/landing/testimonials";

export default function Home() {
  return (
    <main className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <Header />
      <Hero />
      <Features />

      <Clients />
      <CTA />
      <Footer />
    </main>
  );
}
