import {
  SquareTerminal,
  Users,
  FileText,
  BarChart,
  Settings2,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
  HandCoins,
  ShoppingCart,
} from "lucide-react";

export const sidebarMenus = {
  user: {
    name: "James",
    email: "james@example.com",
    avatar: "/avatars/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Activity Logs",
          url: "/dashboard/activity-logs",
        },
      ],
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: HandCoins,
      items: [
        {
          title: "All Leads",
          url: "/dashboard/leads",
        },
        {
          title: "Qualified Leads",
          url: "/dashboard/leads/qualified",
        },
        {
          title: "Lead Scoring",
          url: "/dashboard/leads/lead-scoring",
        },
      ],
    },

    {
      title: "Reports",
      url: "/dashboard/reports/sales",
      icon: BarChart,
      items: [
        {
          title: "Sales Report",
          url: "/dashboard/reports/sales",
        },
        {
          title: "Customer Insights",
          url: "/dashboard/reports/customer-insights",
        },
        {
          title: "Revenue",
          url: "/dashboard/reports/revenue",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart, // Reuse BarChart icon for analytics, or replace with a more suitable icon if available
      items: [
        {
          title: "Overview",
          url: "/dashboard/analytics",
        },
        {
          title: "Funnel Analysis",
          url: "/dashboard/analytics/funnel",
        },
        {
          title: "Engagement Metrics",
          url: "/dashboard/analytics/engagement",
        },
        {
          title: "Cohort Analysis",
          url: "/dashboard/analytics/cohort",
        },
      ],
    },
    {
      title: "Pipelines",
      url: "/dashboard/pipelines",
      icon: BarChart, // Consider replacing with a pipeline-specific icon if available
      items: [
        {
          title: "All Pipelines",
          url: "/dashboard/pipelines",
        },
        {
          title: "Create Pipeline",
          url: "/dashboard/pipelines/create",
        },
        {
          title: "Pipeline Stages",
          url: "/dashboard/pipelines/stages",
        },
        {
          title: "Pipeline Automation",
          url: "/dashboard/pipelines/automation",
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],

  workspaces: [],
};
