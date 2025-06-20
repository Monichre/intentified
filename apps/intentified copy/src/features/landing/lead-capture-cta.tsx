"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export const LeadCaptureCTA = () => {
  const [competitors, setCompetitors] = useState("");
  const [targetActions, setTargetActions] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="bg-grid-white/10 absolute inset-0 bg-[size:20px_20px]" />

      <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold !text-white md:text-4xl lg:text-5xl">
              Ready to Capture "Mid-Funnel" Leads in Real-Time?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
              Help us target your ideal customers. We need:
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800"
          >
            <form className="space-y-6">
              <div>
                <Label
                  htmlFor="competitors"
                  className="mb-2 block font-semibold text-gray-900 dark:text-white"
                >
                  Your Competitors (5 examples)
                </Label>
                <Textarea
                  id="competitors"
                  placeholder="Main websites (e.g., ford.com)&#10;Product pages (e.g., ford.com/f150)"
                  className="min-h-[100px] resize-none"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                />
              </div>

              <div>
                <Label
                  htmlFor="target-actions"
                  className="mb-2 block font-semibold text-gray-900 dark:text-white"
                >
                  Your Target Actions
                </Label>
                <Textarea
                  id="target-actions"
                  placeholder="Demo request pages&#10;Pricing pages&#10;Sign-up forms"
                  className="min-h-[100px] resize-none"
                  value={targetActions}
                  onChange={(e) => setTargetActions(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  Start Free Intent Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  asChild
                >
                  <Link href="/dashboard/onboarding">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Strategy Call
                  </Link>
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
