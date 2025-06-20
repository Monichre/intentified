"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowRight, 
  Globe, 
  Building, 
  CheckCircle, 
  Loader2,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Eye,
  AlertCircle
} from "lucide-react";

interface StreamData {
  type: 'progress' | 'result' | 'error';
  message?: string;
  phase?: string;
  currentStep?: number;
  totalSteps?: number;
  currentType?: string;
  result?: any;
  error?: string;
}

interface AnalysisResult {
  websiteUrl: string;
  requestId: string;
  results: Array<{
    type: string;
    status: 'success' | 'error' | 'skipped';
    data?: any;
    error?: string;
  }>;
  summary: {
    totalRequested: number;
    successful: number;
    failed: number;
    skipped: number;
    totalDuration: number;
    screenshot?: string;
    insightsSummary?: {
      sections: Array<{
        header: string;
        text: string;
      }>;
    };
  };
}

const PHASE_DESCRIPTIONS: Record<string, string> = {
  'initialization': 'Setting up analysis...',
  'basic-info': 'Analyzing company fundamentals...',
  'company-summary': 'Extracting key insights...',
  'competitors': 'Identifying competitive landscape...',
  'funding': 'Researching investment history...',
  'news': 'Gathering market intelligence...',
  'processing': 'Processing data...',
};

export const LeadCaptureFormStreaming = () => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamData, setStreamData] = useState<StreamData[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteUrl) return;

    // Validate URL
    try {
      new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      setError('Please enter a valid website URL');
      return;
    }

    setIsAnalyzing(true);
    setStreamData([]);
    setAnalysisResult(null);
    setError(null);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/intelligence/enrich/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`,
          skipScreenshot: false,
          enrichmentTypes: ['basic-info', 'company-summary', 'competitors', 'funding', 'news']
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('No response stream available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Split on newlines for streaming JSON
        let lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const data: StreamData = JSON.parse(line);
            
            setStreamData(prev => [...prev, data]);
            
            if (data.type === 'result' && data.result) {
              setAnalysisResult(data.result);
            } else if (data.type === 'error') {
              setError(data.error || 'Analysis failed');
            }
          } catch (parseError) {
            console.warn('Failed to parse stream data:', line);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Stream error:', err);
        setError(err.message || 'Failed to start analysis');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsAnalyzing(false);
  };

  const latestProgress = streamData
    .filter(d => d.type === 'progress')
    .pop();

  const progressPercentage = latestProgress?.currentStep && latestProgress?.totalSteps
    ? Math.round((latestProgress.currentStep / latestProgress.totalSteps) * 100)
    : 0;

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    const companySummary = analysisResult.results.find(r => r.type === 'company-summary')?.data;
    const competitors = analysisResult.results.find(r => r.type === 'competitors')?.data;
    const funding = analysisResult.results.find(r => r.type === 'funding')?.data;
    const news = analysisResult.results.find(r => r.type === 'news')?.data;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 space-y-6"
      >
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold">{analysisResult.summary.successful}</div>
              <div className="text-sm text-gray-600">Data Sources</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{Math.round(analysisResult.summary.totalDuration / 1000)}s</div>
              <div className="text-sm text-gray-600">Analysis Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{competitors?.length || 0}</div>
              <div className="text-sm text-gray-600">Competitors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{news?.length || 0}</div>
              <div className="text-sm text-gray-600">News Items</div>
            </CardContent>
          </Card>
        </div>

        {/* Company Summary */}
        {analysisResult.summary.insightsSummary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.summary.insightsSummary.sections.slice(0, 3).map((section, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {section.header}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {section.text.slice(0, 200)}...
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to See More?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is just a preview. Get the full competitive intelligence report and start capturing intent signals.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
            >
              Get Full Report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section id="live-demo" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              See Intent Intelligence in Action
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              Enter any website URL to see our real-time competitive analysis and intent detection
            </p>
          </div>

          {/* Analysis Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
          >
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <Label htmlFor="website" className="text-lg font-semibold text-gray-900 dark:text-white mb-3 block">
                  Website to Analyze
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="website"
                      type="text"
                      placeholder="e.g., openai.com or competitor.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="h-14 text-lg"
                      disabled={isAnalyzing}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isAnalyzing || !websiteUrl}
                    className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 text-red-600"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </div>
            </form>

            {/* Live Progress */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Analysis Progress</h3>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                  
                  <Progress value={progressPercentage} className="w-full" />
                  
                  <div className="space-y-2">
                    {streamData.slice(-5).map((data, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {data.message || PHASE_DESCRIPTIONS[data.phase || 'processing'] || 'Processing...'}
                        </span>
                        {data.phase && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {data.phase}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            {renderAnalysisResult()}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};