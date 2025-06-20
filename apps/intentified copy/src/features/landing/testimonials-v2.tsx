"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Intentified reduced our cost per lead by 73% while improving quality. We're reaching buyers we never knew existed.",
    author: "VP of Marketing",
    company: "SaaS Company",
    image: "/avatars/avatar.png"
  },
  {
    quote: "The speed to lead is incredible. We're talking to prospects while our competitors are still waiting for form fills.",
    author: "Director of Sales",
    company: "B2B Technology",
    image: "/avatars/avatar.png"
  }
];

export const TestimonialsV2 = () => {
  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Companies Who Demand Results
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-200 dark:text-gray-700" />
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};