"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, ArrowLeft, Wand2, Database, Mail, Webhook } from "lucide-react";
import Link from "next/link";

export function CreatePipelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pipelines">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pipelines
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Pipeline</h1>
            <p className="text-muted-foreground">
              Build automated workflows to streamline your business processes.
            </p>
          </div>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Pipeline
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for your pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Pipeline Name</Label>
                <Input
                  id="name"
                  placeholder="Enter pipeline name"
                  defaultValue="Lead Processing Pipeline"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this pipeline does"
                  defaultValue="Automatically process and qualify new leads from various sources"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="trigger">Trigger Type</Label>
                <Select defaultValue="webhook">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webhook">Webhook</SelectItem>
                    <SelectItem value="schedule">Schedule</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="event">Event-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Steps</CardTitle>
              <CardDescription>
                Define the sequence of actions in your pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Webhook className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Webhook Trigger</div>
                      <div className="text-sm text-muted-foreground">Receives lead data from forms</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Trigger</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Database className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Data Validation</div>
                      <div className="text-sm text-muted-foreground">Validate and clean incoming data</div>
                    </div>
                  </div>
                  <Badge variant="outline">Action</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Wand2 className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">AI Scoring</div>
                      <div className="text-sm text-muted-foreground">Score lead quality using AI</div>
                    </div>
                  </div>
                  <Badge variant="outline">Action</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">Send Notification</div>
                      <div className="text-sm text-muted-foreground">Notify sales team of qualified leads</div>
                    </div>
                  </div>
                  <Badge variant="outline">Action</Badge>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Templates</CardTitle>
              <CardDescription>
                Start with a pre-built template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium text-sm">Lead Processing</div>
                <div className="text-xs text-muted-foreground">Qualify and route new leads</div>
              </button>
              
              <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium text-sm">Email Campaign</div>
                <div className="text-xs text-muted-foreground">Automated email sequences</div>
              </button>
              
              <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium text-sm">Data Sync</div>
                <div className="text-xs text-muted-foreground">Sync data between systems</div>
              </button>
              
              <button className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium text-sm">Customer Onboarding</div>
                <div className="text-xs text-muted-foreground">Automate new customer setup</div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
              <CardDescription>
                Drag and drop to add to your pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 border rounded cursor-pointer hover:bg-accent">
                <div className="text-sm font-medium">Send Email</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-accent">
                <div className="text-sm font-medium">Update Database</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-accent">
                <div className="text-sm font-medium">Call API</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-accent">
                <div className="text-sm font-medium">Run AI Analysis</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-accent">
                <div className="text-sm font-medium">Create Task</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-accent">
                <div className="text-sm font-medium">Send Notification</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 