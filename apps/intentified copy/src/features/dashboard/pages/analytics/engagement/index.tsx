"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Clock, MousePointer, Users } from "lucide-react";

export function EngagementMetricsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Engagement Metrics</h1>
        <p className="text-muted-foreground">
          Analyze user engagement and behavior patterns across your platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:32</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.4%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>
              Pages with highest engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">/dashboard/overview</div>
                <div className="text-sm">5:24 avg</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">/dashboard/analytics</div>
                <div className="text-sm">4:18 avg</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">/dashboard/leads</div>
                <div className="text-sm">3:45 avg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Behavior</CardTitle>
            <CardDescription>
              Common user interaction patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">Most Clicked Element</div>
                <div className="text-xs text-muted-foreground">
                  "Create New Lead" button (342 clicks)
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-sm">Popular User Flow</div>
                <div className="text-xs text-muted-foreground">
                  Dashboard → Leads → Lead Scoring
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 