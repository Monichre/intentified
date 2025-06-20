"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

export function CohortAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cohort Analysis</h1>
          <p className="text-muted-foreground">
            Track user retention and behavior patterns over time across different user cohorts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cohorts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                +2 from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Retention (30d)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                +5.2% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nov '24</div>
            <p className="text-xs text-muted-foreground">
              85.4% retention rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center gap-1">
                <ArrowDown className="h-3 w-3" />
                -2.1% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Table</CardTitle>
          <CardDescription>
            Retention rates by month for each user cohort
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Cohort</th>
                  <th className="text-center p-2 font-medium">Size</th>
                  <th className="text-center p-2 font-medium">Month 0</th>
                  <th className="text-center p-2 font-medium">Month 1</th>
                  <th className="text-center p-2 font-medium">Month 2</th>
                  <th className="text-center p-2 font-medium">Month 3</th>
                  <th className="text-center p-2 font-medium">Month 6</th>
                  <th className="text-center p-2 font-medium">Month 12</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Dec 2024</td>
                  <td className="text-center p-2">1,234</td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-blue-100 text-blue-800 rounded text-xs">
                      100%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      85.4%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      72.1%
                    </div>
                  </td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Nov 2024</td>
                  <td className="text-center p-2">987</td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-blue-100 text-blue-800 rounded text-xs">
                      100%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      82.3%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      69.8%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-yellow-100 text-yellow-800 rounded text-xs">
                      58.2%
                    </div>
                  </td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Oct 2024</td>
                  <td className="text-center p-2">756</td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-blue-100 text-blue-800 rounded text-xs">
                      100%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      78.9%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-yellow-100 text-yellow-800 rounded text-xs">
                      65.4%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-yellow-100 text-yellow-800 rounded text-xs">
                      54.7%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-orange-100 text-orange-800 rounded text-xs">
                      42.1%
                    </div>
                  </td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Sep 2024</td>
                  <td className="text-center p-2">1,045</td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-blue-100 text-blue-800 rounded text-xs">
                      100%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      76.2%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-yellow-100 text-yellow-800 rounded text-xs">
                      61.8%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-orange-100 text-orange-800 rounded text-xs">
                      51.3%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-orange-100 text-orange-800 rounded text-xs">
                      38.9%
                    </div>
                  </td>
                  <td className="text-center p-2 text-muted-foreground">-</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">Dec 2023</td>
                  <td className="text-center p-2">892</td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-blue-100 text-blue-800 rounded text-xs">
                      100%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-green-100 text-green-800 rounded text-xs">
                      74.5%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-yellow-100 text-yellow-800 rounded text-xs">
                      59.2%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-orange-100 text-orange-800 rounded text-xs">
                      48.7%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-orange-100 text-orange-800 rounded text-xs">
                      35.4%
                    </div>
                  </td>
                  <td className="text-center p-2">
                    <div className="inline-flex items-center justify-center w-12 h-6 bg-red-100 text-red-800 rounded text-xs">
                      24.1%
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cohorts</CardTitle>
            <CardDescription>
              Cohorts with highest retention rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">December 2024</div>
                  <div className="text-sm text-muted-foreground">1,234 users • 2 months old</div>
                </div>
                <Badge variant="outline" className="text-green-600">85.4%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">November 2024</div>
                  <div className="text-sm text-muted-foreground">987 users • 3 months old</div>
                </div>
                <Badge variant="outline" className="text-green-600">82.3%</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">October 2024</div>
                  <div className="text-sm text-muted-foreground">756 users • 4 months old</div>
                </div>
                <Badge variant="outline" className="text-green-600">78.9%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retention Insights</CardTitle>
            <CardDescription>
              Key patterns and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div className="font-medium text-sm">Improving Trend</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Recent cohorts show 12% better retention compared to 6 months ago
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div className="font-medium text-sm">Seasonal Pattern</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Winter cohorts typically show 15% higher retention rates
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div className="font-medium text-sm">Critical Period</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Most churn occurs between months 2-3, focus on engagement here
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 