"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Zap, Clock, Play, Pause, Settings, CheckCircle, AlertCircle } from "lucide-react";

export function PipelineAutomationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Automation</h1>
          <p className="text-muted-foreground">
            Configure automated triggers, schedules, and workflows for your pipelines.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Automation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Next 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Automations</CardTitle>
            <CardDescription>
              Currently running automated workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium">Lead Processing Pipeline</div>
                  <div className="text-sm text-muted-foreground">Webhook trigger • Every 5 minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Running</Badge>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium">Daily Report Generation</div>
                  <div className="text-sm text-muted-foreground">Schedule trigger • Daily at 9:00 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Running</Badge>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Customer Onboarding</div>
                  <div className="text-sm text-muted-foreground">Event trigger • New customer signup</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Paused</Badge>
                <Switch />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium">Follow-up Email Campaign</div>
                  <div className="text-sm text-muted-foreground">Delay trigger • 3 days after signup</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Running</Badge>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation Settings</CardTitle>
            <CardDescription>
              Global configuration for automated workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-retry">Auto-retry Failed Jobs</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically retry failed automations up to 3 times
                  </div>
                </div>
                <Switch id="auto-retry" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Error Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Send email notifications when automations fail
                  </div>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="logging">Detailed Logging</Label>
                  <div className="text-sm text-muted-foreground">
                    Keep detailed logs of all automation executions
                  </div>
                </div>
                <Switch id="logging" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Pause all automations during maintenance windows
                  </div>
                </div>
                <Switch id="maintenance" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Automation Activity</CardTitle>
          <CardDescription>
            Latest executions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Lead Processing Pipeline</div>
                  <div className="text-xs text-muted-foreground">Processed 23 leads • 2 minutes ago</div>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">Success</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Follow-up Email Campaign</div>
                  <div className="text-xs text-muted-foreground">Sent 45 emails • 15 minutes ago</div>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">Success</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div>
                  <div className="font-medium text-sm">Daily Report Generation</div>
                  <div className="text-xs text-muted-foreground">Failed: Database connection timeout • 1 hour ago</div>
                </div>
              </div>
              <Badge variant="destructive">Failed</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Customer Onboarding</div>
                  <div className="text-xs text-muted-foreground">Onboarded 8 customers • 2 hours ago</div>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600">Success</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Lead Processing Pipeline</div>
                  <div className="text-xs text-muted-foreground">Currently processing 12 leads • Running</div>
                </div>
              </div>
              <Badge variant="secondary">Running</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Automations</CardTitle>
            <CardDescription>
              Upcoming scheduled executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Daily Report Generation</div>
                  <div className="text-xs text-muted-foreground">Tomorrow at 9:00 AM</div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Weekly Analytics Summary</div>
                  <div className="text-xs text-muted-foreground">Monday at 8:00 AM</div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Monthly Data Cleanup</div>
                  <div className="text-xs text-muted-foreground">1st of next month</div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Automation execution statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Total Executions (24h)</div>
                <div className="text-sm">1,247</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Successful Executions</div>
                <div className="text-sm">1,235</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Failed Executions</div>
                <div className="text-sm text-red-600">12</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Average Duration</div>
                <div className="text-sm">2.4s</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 