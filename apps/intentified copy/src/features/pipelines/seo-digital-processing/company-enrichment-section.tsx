"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  DollarSign,
  Users,
  LinkIcon,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { AnalyticsReportCard } from "@/features/pipelines/seo-digital-processing/analytics-report-card";

interface CompanyEnrichmentData {
  basicInfo?: {
    description: string;
    category: string;
  };
  companySummary?: {
    sections: Array<{
      heading: string;
      text: string;
    }>;
  };
  funding?: {
    hasFunding: boolean;
    details?: string;
    summary?: string;
  };
  linkedin?: {
    url: string;
    content: string;
  };
  founders?: Array<{
    name?: string;
    linkedinUrl: string;
    title?: string;
  }>;
  competitors?: Array<{
    name: string;
    description: string;
    website?: string;
  }>;
}

interface CompanyEnrichmentSectionProps {
  enrichmentData: CompanyEnrichmentData;
}

export function CompanyEnrichmentSection({
  enrichmentData,
}: CompanyEnrichmentSectionProps) {
  if (!enrichmentData || Object.keys(enrichmentData).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Intelligence
          </CardTitle>
          <CardDescription>
            No company data could be enriched from the website
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Intelligence
        </CardTitle>
        <CardDescription>
          Automatically discovered insights about your company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnalyticsReportCard data={enrichmentData} />
        {/* Basic Info & Category */}
        {enrichmentData.basicInfo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Company Category</h4>
              <Badge variant="secondary">
                {enrichmentData.basicInfo.category}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {enrichmentData.basicInfo.description}
            </p>
            <Separator />
          </div>
        )}

        {/* Key Insights Grid */}
        {enrichmentData.companySummary &&
          enrichmentData.companySummary.sections.length > 0 && (
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-medium">
                <TrendingUp className="h-4 w-4" />
                Key Business Insights
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {enrichmentData.companySummary.sections
                  .slice(0, 4)
                  .map((section, index) => (
                    <div
                      key={index}
                      className="space-y-1 rounded-lg border p-3"
                    >
                      <h5 className="text-sm font-medium">{section.heading}</h5>
                      <p className="text-muted-foreground text-xs">
                        {section.text}
                      </p>
                    </div>
                  ))}
              </div>
              <Separator />
            </div>
          )}

        {/* Company Status Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Funding Status */}
          {enrichmentData.funding && (
            <div className="space-y-2">
              <h5 className="flex items-center gap-1 text-sm font-medium">
                <DollarSign className="h-3 w-3" />
                Funding
              </h5>
              <Badge
                variant={
                  enrichmentData.funding.hasFunding ? "default" : "secondary"
                }
                className="text-xs"
              >
                {enrichmentData.funding.hasFunding ? "Funded" : "No Data"}
              </Badge>
            </div>
          )}

          {/* Founders Count */}
          {enrichmentData.founders && enrichmentData.founders.length > 0 && (
            <div className="space-y-2">
              <h5 className="flex items-center gap-1 text-sm font-medium">
                <Users className="h-3 w-3" />
                Founders
              </h5>
              <Badge variant="outline" className="text-xs">
                {enrichmentData.founders.length} Found
              </Badge>
            </div>
          )}

          {/* LinkedIn Status */}
          {enrichmentData.linkedin && enrichmentData.linkedin.url && (
            <div className="space-y-2">
              <h5 className="flex items-center gap-1 text-sm font-medium">
                <LinkIcon className="h-3 w-3" />
                LinkedIn
              </h5>
              <a
                href={enrichmentData.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  variant="outline"
                  className="hover:bg-muted cursor-pointer text-xs"
                >
                  Profile ↗
                </Badge>
              </a>
            </div>
          )}

          {/* Competitors Count */}
          {enrichmentData.competitors &&
            enrichmentData.competitors.length > 0 && (
              <div className="space-y-2">
                <h5 className="flex items-center gap-1 text-sm font-medium">
                  <Trophy className="h-3 w-3" />
                  Competitors
                </h5>
                <Badge variant="outline" className="text-xs">
                  {enrichmentData.competitors.length} Found
                </Badge>
              </div>
            )}
        </div>

        {/* Detailed Sections - Collapsible/Expandable */}
        {(enrichmentData.funding?.summary ||
          (enrichmentData.competitors &&
            enrichmentData.competitors.length > 0)) && (
          <>
            <Separator />

            {/* Funding Details */}
            {enrichmentData.funding?.summary && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Funding Details</h5>
                <p className="text-muted-foreground bg-muted/50 rounded p-2 text-xs">
                  {enrichmentData.funding.summary}
                </p>
              </div>
            )}

            {/* Top Competitors */}
            {enrichmentData.competitors &&
              enrichmentData.competitors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Key Competitors</h5>
                  <div className="space-y-2">
                    {enrichmentData.competitors
                      .slice(0, 3)
                      .map((competitor, index) => (
                        <div
                          key={index}
                          className="bg-muted/50 flex items-center justify-between rounded p-2 text-xs"
                        >
                          <div className="flex-1">
                            <span className="font-medium">
                              {competitor.name}
                            </span>
                            <p className="text-muted-foreground truncate">
                              {competitor.description}
                            </p>
                          </div>
                          {competitor.website && (
                            <a
                              href={competitor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <LinkIcon className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
