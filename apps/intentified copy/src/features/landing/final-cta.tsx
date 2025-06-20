"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export const FinalCTA = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 lg:py-32 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Stop Wasting Money on Cold Traffic
          </h2>
          <p className="mb-8 text-xl text-gray-300 md:text-2xl">
            Start Converting Competitor Visitors Today
          </p>

          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-6 text-base hover:from-violet-700 hover:to-indigo-700 sm:w-auto"
              asChild
            >
              <Link href="/dashboard/onboarding">
                Get Your Free Intent Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-400">
            <span>Or call us:</span>
            <a
              href="tel:612-578-5104"
              className="flex items-center gap-2 text-white transition-colors hover:text-violet-400"
            >
              612-578-5104
            </a>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-500">
              Intentified | Making Intent Data Actually Work
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
