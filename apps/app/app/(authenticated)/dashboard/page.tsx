import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@repo/auth/server";
import { database } from "@repo/db";
import { createMetadata } from "@repo/seo/metadata";
import dynamic from "next/dynamic";
import { 
  BarChart3, 
  Zap, 
  Sparkles, 
  Target, 
  ArrowRight, 
  Globe, 
  LineChart, 
  PlusCircle
} from "lucide-react";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";

// Dynamically import the UnifiedPipelines component
const UnifiedPipelines = dynamic(
  () => import("@/features/pipelines/unified-pipelines").then(mod => mod.UnifiedPipelines),
  { ssr: false }
);

export const metadata = createMetadata({
  title: "Dashboard | Intentified",
  description: "Track customer intent signals and optimize your marketing ROI"
});

// Mock data for intent signals (would come from actual API/database in production)
const RECENT_INTENT_SIGNALS = [
  {
    id: "signal-1",
    source: "Website",
    action: "Viewed pricing page 3 times",
    intent: "High purchase intent",
    timestamp: "2 hours ago",
    score: 85
  },
  {
    id: "signal-2",
    source: "Email",
    action: "Opened product demo email",
    intent: "Research phase",
    timestamp: "5 hours ago",
    score: 62
  },
  {
    id: "signal-3",
    source: "Search",
    action: "Searched for comparison terms",
    intent: "Evaluation phase",
    timestamp: "Yesterday",
    score: 74
  }
];

// Dashboard loading skeleton
function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[120px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[120px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[120px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  // Check if user has completed onboarding
  const userProfile = await database.user.findUnique({
    where: { id: user.id },
    select: { onboardingCompleted: true }
  });
  
  // Redirect to onboarding if not completed
  if (!userProfile?.onboardingCompleted) {
    redirect("/onboarding");
  }
  
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.firstName || user.username}</h1>
          <p className="text-muted-foreground">
            Track your customer intent signals and optimize your marketing ROI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Globe className="mr-2 h-4 w-4" />
            Scan Website
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Dashboard content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intent-hub">Intent Hub</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Intent Signals</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">
                  +14% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">
                  +0.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Live on your website
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">ROI Score</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72/100</div>
                <p className="text-xs text-muted-foreground">
                  Based on intent quality
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Intent signals and analytics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent intent signals */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Intent Signals</CardTitle>
                <CardDescription>
                  Customer actions indicating purchase intent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_INTENT_SIGNALS.map((signal) => (
                    <div key={signal.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{signal.action}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{signal.source}</span>
                          <span className="mx-2">•</span>
                          <span>{signal.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-medium">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            signal.score > 80 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                              : signal.score > 60 
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}>
                            {signal.intent}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Signals
                </Button>
              </CardFooter>
            </Card>
            
            {/* Analytics overview */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  Traffic and conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                  <div className="flex flex-col items-center">
                    <BarChart3 className="h-16 w-16 mb-2 opacity-50" />
                    <p className="text-sm">Analytics visualization</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Detailed Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Quick actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Website Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground">
                  Run a full analysis of your website to identify intent signals and optimization opportunities.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Start Analysis
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">SEO Audit</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground">
                  Check your website's SEO performance and get recommendations for improvement.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Run Audit
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Content Generator</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground">
                  Generate intent-optimized content for your website, emails, and ads.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Create Content
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Connect Analytics</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground">
                  Connect Google Analytics, Facebook Ads, and other tools to track ROI.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Connect Tools
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="intent-hub" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intent Hub</CardTitle>
              <CardDescription>
                Access all AI processing pipelines in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-16rem)]">
              <Suspense fallback={<div className="p-6">Loading Intent Hub...</div>}>
                <UnifiedPipelines />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics for your marketing performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Detailed analytics dashboard will appear here</p>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>
                  Customize your dashboard and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Settings panel will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
