"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is this really legal?",
    answer: "Yes, 100%. We only use publicly available data and comply with all privacy regulations. No hacking, no stolen data—just smart technology."
  },
  {
    question: "How fast can we start?",
    answer: "Most clients see first leads within 48 hours of setup. Full optimization takes 2-3 weeks."
  },
  {
    question: "What makes you different from other intent data providers?",
    answer: "Scale (1.9T signals), speed (real-time), and execution (we send the emails, not just provide data)."
  },
  {
    question: "What's the minimum budget?",
    answer: "We work with businesses spending $5,000+/month on marketing who want better ROI."
  }
];

export const FAQV2 = () => {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-gray-900 dark:text-white font-semibold hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};