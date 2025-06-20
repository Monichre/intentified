"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Users, Target, ArrowDown } from "lucide-react";

export function FunnelAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funnel Analysis</h1>
        <p className="text-muted-foreground">
          Track user conversion through your sales funnel and identify optimization opportunities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">
              Top of funnel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,421</div>
            <p className="text-xs text-muted-foreground">
              26.6% conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              36.4% of leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              27.4% close rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>
            Visual representation of user flow through your funnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium">Website Visitors</div>
                  <div className="text-sm text-muted-foreground">Total unique visitors</div>
                </div>
              </div>
              <div className="text-xl font-bold">12,847</div>
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium">Leads Generated</div>
                  <div className="text-sm text-muted-foreground">Form submissions, signups</div>
                </div>
              </div>
              <div className="text-xl font-bold">3,421 <span className="text-sm text-muted-foreground">(26.6%)</span></div>
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-orange-500 rounded-full" />
                <div>
                  <div className="font-medium">Qualified Leads</div>
                  <div className="text-sm text-muted-foreground">Sales qualified prospects</div>
                </div>
              </div>
              <div className="text-xl font-bold">1,247 <span className="text-sm text-muted-foreground">(36.4%)</span></div>
            </div>
            
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-purple-500 rounded-full" />
                <div>
                  <div className="font-medium">Customers</div>
                  <div className="text-sm text-muted-foreground">Closed deals</div>
                </div>
              </div>
              <div className="text-xl font-bold">342 <span className="text-sm text-muted-foreground">(27.4%)</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Bottlenecks</CardTitle>
            <CardDescription>
              Areas with the highest drop-off rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Visitor to Lead</div>
                <div className="text-sm text-red-500">73.4% drop-off</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Lead to Qualified</div>
                <div className="text-sm text-orange-500">63.6% drop-off</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Qualified to Customer</div>
                <div className="text-sm text-yellow-500">72.6% drop-off</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimization Opportunities</CardTitle>
            <CardDescription>
              Recommended improvements for your funnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">Improve Lead Magnet</div>
                <div className="text-xs text-muted-foreground">
                  Increase visitor-to-lead conversion with better CTAs
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">Lead Scoring</div>
                <div className="text-xs text-muted-foreground">
                  Better qualify leads before sales handoff
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">Sales Process</div>
                <div className="text-xs text-muted-foreground">
                  Streamline qualification to close process
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 