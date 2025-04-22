"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  ArrowUpRight,
  DollarSign,
  LineChart,
  PieChart,
  Heart,
  Target,
  Zap,
  UserPlus,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

export function OverviewPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Analytics
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">
            Last 7 Days
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none">
            Last 30 Days
          </Button>
          <Button className="flex-1 sm:flex-none">Custom Range</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Acquisition Cost
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">$42.35</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center font-medium text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> -5.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Lifetime Value
            </CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">$1,250</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center font-medium text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +12.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Retention
            </CardTitle>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">78.3%</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center font-medium text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +3.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lead Conversion Rate
            </CardTitle>
            <Zap className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">24.8%</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <span className="mr-1 flex items-center font-medium text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 w-3" /> +4.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Customer Journey Stages</CardTitle>
            <CardDescription>
              Distribution of customers across sales funnel
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed p-4 text-center sm:h-[240px]">
              <div className="flex flex-col items-center gap-2">
                <BarChart3 className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Customer funnel visualization
                </p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">
                  Awareness → Consideration → Decision → Loyalty
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed p-4 text-center sm:h-[240px]">
              <div className="flex flex-col items-center gap-2">
                <PieChart className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Lead sources distribution
                </p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">
                  Website, referrals, social media, direct, etc.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Tasks */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Customer Interactions</CardTitle>
            <CardDescription>
              Latest customer touchpoints and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 rounded-lg border p-2 sm:items-center sm:p-3">
                <div className="bg-primary/10 flex-shrink-0 rounded-full p-1.5 sm:p-2">
                  <Phone className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                  <p className="truncate text-xs leading-tight font-medium sm:text-sm">
                    Sales call completed
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-[10px] sm:text-xs">
                    15-minute call with Acme Corp about premium plan
                  </p>
                </div>
                <div className="text-muted-foreground ml-2 flex-shrink-0 text-[10px] whitespace-nowrap sm:text-xs">
                  10m ago
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border p-2 sm:items-center sm:p-3">
                <div className="bg-primary/10 flex-shrink-0 rounded-full p-1.5 sm:p-2">
                  <Mail className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                  <p className="truncate text-xs leading-tight font-medium sm:text-sm">
                    Follow-up email sent
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-[10px] sm:text-xs">
                    Proposal sent to TechStart Inc. regarding enterprise
                    solution
                  </p>
                </div>
                <div className="text-muted-foreground ml-2 flex-shrink-0 text-[10px] whitespace-nowrap sm:text-xs">
                  45m ago
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border p-2 sm:items-center sm:p-3">
                <div className="bg-primary/10 flex-shrink-0 rounded-full p-1.5 sm:p-2">
                  <UserPlus className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                  <p className="truncate text-xs leading-tight font-medium sm:text-sm">
                    New lead created
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-[10px] sm:text-xs">
                    GlobalTech added as a new lead from website contact form
                  </p>
                </div>
                <div className="text-muted-foreground ml-2 flex-shrink-0 text-[10px] whitespace-nowrap sm:text-xs">
                  2h ago
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border p-2 sm:items-center sm:p-3">
                <div className="bg-primary/10 flex-shrink-0 rounded-full p-1.5 sm:p-2">
                  <MessageSquare className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                  <p className="truncate text-xs leading-tight font-medium sm:text-sm">
                    Support ticket resolved
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-[10px] sm:text-xs">
                    Resolved billing issue for Quantum Solutions LLC
                  </p>
                </div>
                <div className="text-muted-foreground ml-2 flex-shrink-0 text-[10px] whitespace-nowrap sm:text-xs">
                  3h ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Customer Engagement</CardTitle>
            <CardDescription>
              Activity metrics across customer touchpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-dashed p-4 text-center sm:h-[240px]">
              <div className="flex flex-col items-center gap-2">
                <LineChart className="text-muted-foreground h-6 w-6 sm:h-8 sm:w-8" />
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Engagement metrics visualization
                </p>
                <p className="text-muted-foreground text-[10px] sm:text-xs">
                  Email opens, website visits, call duration, response time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
