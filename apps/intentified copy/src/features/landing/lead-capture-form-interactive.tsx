"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight, 
  Globe, 
  MousePointer, 
  Target,
  Plus,
  X,
  CheckCircle,
  Building,
  Link2
} from "lucide-react";
import Link from "next/link";

interface CompetitorInput {
  id: string;
  url: string;
}

interface TargetActionInput {
  id: string;
  url: string;
}

export const LeadCaptureFormInteractive = () => {
  const [competitors, setCompetitors] = useState<CompetitorInput[]>([
    { id: '1', url: '' }
  ]);
  const [targetActions, setTargetActions] = useState<TargetActionInput[]>([
    { id: '1', url: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, { id: Date.now().toString(), url: '' }]);
    }
  };

  const removeCompetitor = (id: string) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter(c => c.id !== id));
    }
  };

  const updateCompetitor = (id: string, url: string) => {
    setCompetitors(competitors.map(c => c.id === id ? { ...c, url } : c));
  };

  const addTargetAction = () => {
    if (targetActions.length < 5) {
      setTargetActions([...targetActions, { id: Date.now().toString(), url: '' }]);
    }
  };

  const removeTargetAction = (id: string) => {
    if (targetActions.length > 1) {
      setTargetActions(targetActions.filter(t => t.id !== id));
    }
  };

  const updateTargetAction = (id: string, url: string) => {
    setTargetActions(targetActions.map(t => t.id === id ? { ...t, url } : t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  return (
    <section id="lead-capture" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Capture "Mid-Funnel" Leads in Real-Time?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Help us target your ideal customers by providing the information below
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Competitors Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Competitors
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({competitors.length}/5)
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  List competitor websites and specific product pages you want to monitor
                </p>

                <div className="space-y-3">
                  {competitors.map((competitor, index) => (
                    <motion.div
                      key={competitor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3"
                    >
                      <div className="flex-1">
                        <Input
                          placeholder={index === 0 ? "e.g., ford.com" : "e.g., ford.com/f150"}
                          value={competitor.url}
                          onChange={(e) => updateCompetitor(competitor.id, e.target.value)}
                          className="h-12"
                        />
                      </div>
                      {competitors.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCompetitor(competitor.id)}
                          className="h-12 w-12"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {competitors.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompetitor}
                    className="mt-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Competitor
                  </Button>
                )}
              </div>

              {/* Target Actions Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Target Actions
                  </Label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({targetActions.length}/5)
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  List pages that indicate high buying intent (demo requests, pricing, sign-ups)
                </p>

                <div className="space-y-3">
                  {targetActions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-3"
                    >
                      <div className="flex-1">
                        <Input
                          placeholder={
                            index === 0 
                              ? "e.g., competitor.com/demo" 
                              : index === 1 
                              ? "e.g., competitor.com/pricing"
                              : "e.g., competitor.com/signup"
                          }
                          value={action.url}
                          onChange={(e) => updateTargetAction(action.id, e.target.value)}
                          className="h-12"
                        />
                      </div>
                      {targetActions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTargetAction(action.id)}
                          className="h-12 w-12"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>

                {targetActions.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTargetAction}
                    className="mt-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Target Action
                  </Button>
                )}
              </div>

              {/* Submit Section */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Start Free Intent Analysis
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/dashboard/onboarding">
                      Schedule Strategy Call
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Results in 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};