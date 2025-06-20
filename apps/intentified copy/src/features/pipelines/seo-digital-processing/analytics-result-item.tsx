import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type {
  ResultItem,
  GenericResultInfo,
  CompanySummaryData,
  MindMapData,
  MindMapNode,
} from "@/lib/types";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Info,
  Briefcase,
  Users,
  Newspaper,
  BarChart2,
  Brain,
  Users2,
  LinkIcon,
  MessageSquare,
  Globe,
  Youtube,
  FileText,
  ShoppingCart,
  Target,
  DollarSign,
  Star,
  Zap,
  ShieldCheck,
  Linkedin,
  Github,
  Twitter,
  RssIcon as Reddit,
  UserCircle,
  Lightbulb,
  BuildingIcon,
} from "lucide-react";
import { cn } from "@/utils/utils";

const formatDuration = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

const getStatusBadgeClassName = (status: string): string => {
  if (status === "success")
    return "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300";
  if (status === "error")
    return "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300";
  return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"; // for pending or other statuses
};

const getStatusIcon = (status: string) => {
  if (status === "success")
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === "error") return <XCircle className="h-4 w-4 text-red-500" />;
  return <AlertCircle className="h-4 w-4 text-yellow-500" />;
};

const getTypeIcon = (type: string) => {
  const iconProps = { className: "h-5 w-5 mr-2" };
  switch (type) {
    case "basic-info":
      return <Info {...iconProps} />;
    case "company-summary":
      return <Briefcase {...iconProps} />;
    case "funding":
      return <DollarSign {...iconProps} />;
    case "linkedin":
      return <Linkedin {...iconProps} />;
    case "founders":
      return <Users {...iconProps} />;
    case "crunchbase":
      return <BuildingIcon {...iconProps} />;
    case "news":
      return <Newspaper {...iconProps} />;
    case "financial-report":
      return <BarChart2 {...iconProps} />;
    case "github-url":
      return <Github {...iconProps} />;
    case "pitchbook":
      return <FileText {...iconProps} />;
    case "tiktok":
      return <MessageSquare {...iconProps} />; // No specific TikTok icon in Lucide
    case "tracxn":
      return <Lightbulb {...iconProps} />;
    case "wikipedia":
      return <Globe {...iconProps} />; // Using Globe as a generic for Wikipedia
    case "youtube-videos":
      return <Youtube {...iconProps} />;
    case "recent-tweets":
      return <Twitter {...iconProps} />;
    case "reddit":
      return <Reddit {...iconProps} />;
    case "twitter-profile":
      return <UserCircle {...iconProps} />;
    case "website-sub-pages":
      return <LinkIcon {...iconProps} />;
    case "website-url":
      return <Globe {...iconProps} />;
    case "youtube-video-details":
      return <Youtube {...iconProps} />;
    case "competitors":
      return <Users2 {...iconProps} />;
    case "mind-map":
      return <Brain {...iconProps} />;
    default:
      return <Info {...iconProps} />;
  }
};

const RenderGenericResults = ({
  results,
}: {
  results: GenericResultInfo[];
}) => {
  if (!results || results.length === 0) {
    return <p className="text-muted-foreground text-sm">No data found.</p>;
  }
  return (
    <div className="space-y-3">
      {results.map((item, idx) => (
        <div
          key={idx}
          className="rounded-md border bg-white p-3 shadow-sm dark:bg-slate-800"
        >
          {item.title && (
            <h4 className="text-md mb-1 font-semibold">{item.title}</h4>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 block truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              {item.url} <ExternalLink className="ml-1 inline h-3 w-3" />
            </a>
          )}
          {item.summary && (
            <p className="text-muted-foreground mb-1 text-sm">
              <strong className="text-slate-700 dark:text-slate-300">
                Summary:
              </strong>{" "}
              {item.summary}
            </p>
          )}
          {item.text && (
            <p className="line-clamp-3 text-sm text-gray-700 transition-all duration-200 hover:line-clamp-none dark:text-gray-300">
              {item.text}
            </p>
          )}
          {item.publishedDate && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Published: {new Date(item.publishedDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const RenderMindMapNode = ({
  node,
  level = 0,
}: {
  node: MindMapNode;
  level?: number;
}) => (
  <div style={{ marginLeft: `${level * 20}px` }} className="mb-2">
    <strong className="font-semibold text-slate-800 dark:text-slate-200">
      {node.title}
    </strong>
    {node.description && (
      <p className="text-muted-foreground text-xs">{node.description}</p>
    )}
    {node.children && node.children.length > 0 && (
      <div className="mt-1 border-l-2 border-slate-200 pl-4 dark:border-slate-700">
        {node.children.map((child, childIdx) => (
          <RenderMindMapNode key={childIdx} node={child} level={level + 1} />
        ))}
      </div>
    )}
  </div>
);

export function AnalyticsResultItem({ result }: { result: ResultItem }) {
  const renderContent = () => {
    if (result.status === "error") {
      return (
        <Alert variant="destructive" className="mt-2">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {result.error || "An unknown error occurred."}
          </AlertDescription>
        </Alert>
      );
    }

    if (!result.data) {
      return (
        <p className="text-muted-foreground p-2 text-sm">
          No data available for this section.
        </p>
      );
    }

    // Handle types that often have data.results as an empty array
    const isEmptyResults =
      Array.isArray((result.data as any).results) &&
      (result.data as any).results.length === 0;

    switch (result.type) {
      case "basic-info":
      case "website-url":
      case "linkedin":
      case "competitors":
      case "news":
      case "financial-report":
      case "github-url":
      case "pitchbook":
      case "tiktok":
      case "tracxn":
      case "wikipedia":
      case "youtube-videos":
      case "reddit":
      case "website-sub-pages":
        return (
          <RenderGenericResults
            results={(result.data as { results: GenericResultInfo[] }).results}
          />
        );

      case "funding":
      case "founders":
      case "crunchbase":
        if (isEmptyResults)
          return (
            <p className="text-muted-foreground p-2 text-sm">
              No {result.type.replace(/-/g, " ")} data found.
            </p>
          );
        return (
          <RenderGenericResults
            results={(result.data as { results: GenericResultInfo[] }).results}
          />
        );

      case "company-summary":
        const companySummaryData = result.data as CompanySummaryData;
        return (
          <div className="space-y-3">
            {companySummaryData.sections.map((section, idx) => {
              let IconComponent;
              if (section.heading.startsWith("🚗"))
                IconComponent = ShoppingCart;
              else if (section.heading.startsWith("🎯")) IconComponent = Target;
              else if (section.heading.startsWith("💰"))
                IconComponent = DollarSign;
              else if (section.heading.startsWith("🌟")) IconComponent = Star;
              else if (section.heading.startsWith("💪")) IconComponent = Zap;
              else if (section.heading.startsWith("🔒"))
                IconComponent = ShieldCheck;

              return (
                <div
                  key={idx}
                  className="rounded-md border bg-white p-3 shadow-sm dark:bg-slate-800"
                >
                  <h4 className="text-md mb-1 flex items-center font-semibold">
                    {IconComponent && (
                      <IconComponent className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-400" />
                    )}
                    {section.heading.replace(/^[🚗🎯💰🌟💪🔒]\s*/u, "")}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {section.text}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case "mind-map":
        const mindMapData = result.data as MindMapData;
        return mindMapData.rootNode ? (
          <RenderMindMapNode node={mindMapData.rootNode} />
        ) : (
          <p className="text-muted-foreground p-2 text-sm">No mind map data.</p>
        );

      default:
        if (isEmptyResults && !result.data) {
          return (
            <p className="text-muted-foreground p-2 text-sm">
              No data found for {result.type.replace(/-/g, " ")}.
            </p>
          );
        }
        return (
          <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        );
    }
  };

  return (
    <AccordionItem
      value={result.type}
      className="border-b border-slate-200 last:border-b-0 dark:border-slate-700"
    >
      <AccordionTrigger className="rounded-t-md p-3 text-left transition-colors hover:bg-slate-50 hover:no-underline dark:hover:bg-slate-800/50">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {getTypeIcon(result.type)}
            <span className="font-medium text-slate-700 capitalize dark:text-slate-200">
              {result.type.replace(/-/g, " ")}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={cn(
                "px-2 py-0.5 text-xs",
                getStatusBadgeClassName(result.status),
              )}
            >
              {getStatusIcon(result.status)}
              <span className="ml-1">{result.status}</span>
            </Badge>
            <span className="text-muted-foreground flex items-center text-xs">
              <Clock className="mr-1 h-3 w-3" />{" "}
              {formatDuration(result.duration)}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="rounded-b-md bg-slate-50 px-3 pt-0 pb-3 dark:bg-slate-900/70">
        {renderContent()}
      </AccordionContent>
    </AccordionItem>
  );
}
