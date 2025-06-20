"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Settings, GitBranch, Zap, FileText, Search, Wand2, BarChart3, Play, Pause, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function PipelinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipelines</h1>
          <p className="text-muted-foreground">
            Manage and monitor your automated workflows and data pipelines.
          </p>
        </div>
        <Link href="/dashboard/pipelines/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Pipeline
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pipelines</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2 from last week</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18% from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5% improvement</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-0.3s faster</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Templates</CardTitle>
            <CardDescription>
              Pre-built pipelines ready to deploy and customize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">AI Agents Processing</div>
                  <div className="text-sm text-muted-foreground">Intelligent data processing with AI agents</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Ready</Badge>
                <Button size="sm" variant="outline">Deploy</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">AI Prompting Pipeline</div>
                  <div className="text-sm text-muted-foreground">Advanced prompt engineering and processing</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Ready</Badge>
                <Button size="sm" variant="outline">Deploy</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Document Processing</div>
                  <div className="text-sm text-muted-foreground">Extract, analyze, and process documents</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Ready</Badge>
                <Button size="sm" variant="outline">Deploy</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium">SEO Digital Processing</div>
                  <div className="text-sm text-muted-foreground">Optimize and analyze SEO performance</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Ready</Badge>
                <Button size="sm" variant="outline">Deploy</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Pipelines</CardTitle>
            <CardDescription>
              Currently running and scheduled pipelines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium">Lead Processing Pipeline</div>
                  <div className="text-sm text-muted-foreground">Processing 23 leads • 2 min ago</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={78} className="w-16" />
                    <span className="text-xs text-muted-foreground">78%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-green-600">Running</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Pipeline
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-medium">Document Analysis</div>
                  <div className="text-sm text-muted-foreground">Analyzing 15 documents • 5 min ago</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={45} className="w-16" />
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-blue-600">Running</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Pipeline
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium">SEO Analysis Pipeline</div>
                  <div className="text-sm text-muted-foreground">Scheduled for 10:00 AM</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Next run in 2 hours</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline">Scheduled</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Play className="mr-2 h-4 w-4" />
                      Run Now
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common pipeline operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/pipelines/create" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create New Pipeline
              </Button>
            </Link>
            
            <Link href="/dashboard/pipelines/stages" className="block">
              <Button variant="outline" className="w-full justify-start">
                <GitBranch className="mr-2 h-4 w-4" />
                Manage Stages
              </Button>
            </Link>
            
            <Link href="/dashboard/pipelines/automation" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="mr-2 h-4 w-4" />
                Automation Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest pipeline executions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Lead processing completed</div>
                <div className="text-muted-foreground text-xs">2 minutes ago</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Document analysis started</div>
                <div className="text-muted-foreground text-xs">5 minutes ago</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">AI prompt pipeline deployed</div>
                <div className="text-muted-foreground text-xs">15 minutes ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Avg Execution Time</div>
              <div className="text-sm">2.4s</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Success Rate</div>
              <div className="text-sm text-green-600">98.2%</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Daily Executions</div>
              <div className="text-sm">1,247</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Error Rate</div>
              <div className="text-sm text-red-600">1.8%</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 