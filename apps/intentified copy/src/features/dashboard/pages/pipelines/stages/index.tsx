"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, MoreVertical, Play, Pause, ArrowRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function PipelineStagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Stages</h1>
          <p className="text-muted-foreground">
            Configure and manage the stages of your automated pipelines.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Stage
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stages</CardTitle>
            <Badge variant="outline">12</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              Across all pipelines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stages</CardTitle>
            <Badge variant="secondary">Running</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Badge variant="outline" className="text-green-600">98.2%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,821</div>
            <p className="text-xs text-muted-foreground">
              Successful executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Badge variant="outline">2.4s</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8s</div>
            <p className="text-xs text-muted-foreground">
              Per stage execution
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Processing Pipeline</CardTitle>
          <CardDescription>
            Stages for processing and qualifying new leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <div className="font-medium">Data Ingestion</div>
                  <div className="text-sm text-muted-foreground">Receive and validate incoming lead data</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">147 processed today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={85} className="w-16" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete Stage
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">2</span>
                </div>
                <div>
                  <div className="font-medium">AI Qualification</div>
                  <div className="text-sm text-muted-foreground">Score lead quality using AI analysis</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">132 qualified today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={92} className="w-16" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete Stage
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">3</span>
                </div>
                <div>
                  <div className="font-medium">Sales Assignment</div>
                  <div className="text-sm text-muted-foreground">Route qualified leads to sales representatives</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">89 assigned today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={78} className="w-16" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete Stage
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-orange-600">4</span>
                </div>
                <div>
                  <div className="font-medium">Follow-up Automation</div>
                  <div className="text-sm text-muted-foreground">Send automated follow-up emails and notifications</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">156 emails sent today</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={94} className="w-16" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Stage
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete Stage
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stage Performance</CardTitle>
            <CardDescription>
              Execution metrics for each stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Data Ingestion</div>
                <div className="text-sm">1.2s avg</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">AI Qualification</div>
                <div className="text-sm">2.8s avg</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Sales Assignment</div>
                <div className="text-sm">0.9s avg</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Follow-up Automation</div>
                <div className="text-sm">1.5s avg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Tracking</CardTitle>
            <CardDescription>
              Recent stage failures and issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">AI Qualification timeout</div>
                  <Badge variant="destructive" className="text-xs">Error</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">2 occurrences today</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Email delivery failed</div>
                  <Badge variant="destructive" className="text-xs">Error</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">1 occurrence today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 