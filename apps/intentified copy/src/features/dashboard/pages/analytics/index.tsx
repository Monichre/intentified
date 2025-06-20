"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Users, Activity } from "lucide-react";

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground">
          Get insights into your business performance and customer behavior.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,423</div>
            <p className="text-xs text-muted-foreground">
              +8% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23,456</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common analytics tasks and reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/dashboard/analytics/funnel" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Funnel Analysis</div>
              <div className="text-sm text-muted-foreground">
                Track user conversion through your funnel
              </div>
            </a>
            <a 
              href="/dashboard/analytics/engagement" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Engagement Metrics</div>
              <div className="text-sm text-muted-foreground">
                Analyze user engagement and behavior
              </div>
            </a>
            <a 
              href="/dashboard/analytics/cohort" 
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Cohort Analysis</div>
              <div className="text-sm text-muted-foreground">
                Track user retention over time
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest analytics events and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="text-sm">
                  <div className="font-medium">New user cohort analysis completed</div>
                  <div className="text-muted-foreground">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="text-sm">
                  <div className="font-medium">Weekly engagement report generated</div>
                  <div className="text-muted-foreground">1 day ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div className="text-sm">
                  <div className="font-medium">Funnel conversion rates updated</div>
                  <div className="text-muted-foreground">2 days ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 