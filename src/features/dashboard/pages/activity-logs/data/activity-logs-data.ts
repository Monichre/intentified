// Types for activity logs
export interface ActivityLog {
  id: string;
  type: "user" | "contact" | "lead" | "deal" | "task" | "email";
  description: string;
  user: string;
  entity?: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Helper to create timestamps
function getTimestamp(offset: number): string {
  return new Date(Date.now() + offset).toISOString();
}

// Mock data for activity logs with comprehensive date test cases
const activityLogsMockData: ActivityLog[] = [
  // === VERY RECENT (SECONDS) ===
  {
    id: "1",
    type: "user",
    description: "User logged in (just now)",
    user: "John Doe",
    timestamp: getTimestamp(-1000 * 5), // 5 seconds ago
  },
  {
    id: "2",
    type: "user",
    description: "User session started (30 seconds ago)",
    user: "John Doe",
    timestamp: getTimestamp(-1000 * 30), // 30 seconds ago
  },

  // === MINUTES AGO ===
  {
    id: "3",
    type: "lead",
    description: "New lead created (1 minute ago)",
    user: "Sarah Chen",
    entity: "Acme Corporation",
    timestamp: getTimestamp(-1000 * 60), // 1 minute ago
    details: {
      source: "Website",
      score: 85,
    },
  },
  {
    id: "4",
    type: "lead",
    description: "Lead status updated (10 minutes ago)",
    user: "Sarah Chen",
    entity: "Acme Corporation",
    timestamp: getTimestamp(-1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: "5",
    type: "email",
    description: "Email sent to client (45 minutes ago)",
    user: "John Doe",
    entity: "TechStart Inc.",
    timestamp: getTimestamp(-1000 * 60 * 45), // 45 minutes ago
    details: {
      subject: "Follow-up on our meeting",
      read: true,
    },
  },

  // === HOURS AGO (WITHIN MAX_HOURS_RELATIVE) ===
  {
    id: "6",
    type: "contact",
    description: "Contact information updated (2 hours ago)",
    user: "Emily Johnson",
    entity: "Robert Smith",
    timestamp: getTimestamp(-1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "7",
    type: "task",
    description: "Task completed: Prepare sales presentation (4 hours ago)",
    user: "Sarah Chen",
    timestamp: getTimestamp(-1000 * 60 * 60 * 4), // 4 hours ago
  },

  // === HOURS AGO (BEYOND MAX_HOURS_RELATIVE BUT STILL TODAY) ===
  {
    id: "8",
    type: "deal",
    description: "Deal updated to Negotiation stage (8 hours ago)",
    user: "Alex Wong",
    entity: "GlobalTech Solutions",
    timestamp: getTimestamp(-1000 * 60 * 60 * 8), // 8 hours ago
    details: {
      value: 75000,
      previousStage: "Proposal",
      currentStage: "Negotiation",
    },
  },
  {
    id: "9",
    type: "user",
    description: "User profile updated (12 hours ago)",
    user: "Emily Johnson",
    timestamp: getTimestamp(-1000 * 60 * 60 * 12), // 12 hours ago
  },

  // === YESTERDAY ===
  {
    id: "10",
    type: "email",
    description: "Email received from prospect (yesterday)",
    user: "John Doe",
    entity: "Innovate Systems",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 1.2), // ~29 hours ago (yesterday)
  },

  // === DAYS AGO (WITHIN WEEK) ===
  {
    id: "11",
    type: "lead",
    description: "Lead converted to opportunity (2 days ago)",
    user: "Sarah Chen",
    entity: "Quantum Solutions",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "12",
    type: "deal",
    description: "Deal closed won (3 days ago)",
    user: "Alex Wong",
    entity: "Nexus Technologies",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 3), // 3 days ago
    details: {
      value: 48000,
      term: "1 year",
    },
  },
  {
    id: "13",
    type: "contact",
    description: "New contact added (5 days ago)",
    user: "Emily Johnson",
    entity: "Michael Brown",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 5), // 5 days ago
  },

  // === WEEKS AGO ===
  {
    id: "14",
    type: "task",
    description: "Task reassigned: Follow up with client (1 week ago)",
    user: "John Doe",
    entity: "TechStart Inc.",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 7), // 1 week ago
  },
  {
    id: "15",
    type: "email",
    description: "Email campaign sent (2 weeks ago)",
    user: "Sarah Chen",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 14), // 2 weeks ago
    details: {
      recipients: 125,
      openRate: "32%",
    },
  },

  // === MONTHS AGO (SAME YEAR) ===
  {
    id: "16",
    type: "user",
    description: "New user created (1 month ago)",
    user: "Admin",
    entity: "David Wilson",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 30), // ~1 month ago
  },
  {
    id: "17",
    type: "deal",
    description: "Deal moved to Discovery stage (3 months ago)",
    user: "Alex Wong",
    entity: "FastTrack Inc.",
    timestamp: getTimestamp(-1000 * 60 * 60 * 24 * 90), // ~3 months ago
  },

  // === LAST YEAR ===
  {
    id: "18",
    type: "contact",
    description: "Customer relationship established (last year)",
    user: "Emily Johnson",
    entity: "Quantum Innovations",
    timestamp: new Date(new Date().getFullYear() - 1, 5, 15).toISOString(), // Last year, June 15
  },

  //// === FUTURE TIMESTAMPS ===
  // {
  //   id: "19",
  //   type: "task",
  //   description: "Upcoming task (in 30 seconds)",
  //   user: "John Doe",
  //   entity: "Follow-up call",
  //   timestamp: getTimestamp(1000 * 30), // 30 seconds in the future
  // },
  // {
  //   id: "20",
  //   type: "task",
  //   description: "Upcoming task (in 10 minutes)",
  //   user: "Sarah Chen",
  //   entity: "Client presentation",
  //   timestamp: getTimestamp(1000 * 60 * 10), // 10 minutes in the future
  // },
  // {
  //   id: "21",
  //   type: "task",
  //   description: "Scheduled meeting (in 3 hours)",
  //   user: "Alex Wong",
  //   entity: "Product demo",
  //   timestamp: getTimestamp(1000 * 60 * 60 * 3), // 3 hours in the future
  // },
  // {
  //   id: "22",
  //   type: "task",
  //   description: "Deadline (tomorrow)",
  //   user: "Emily Johnson",
  //   entity: "Project proposal",
  //   timestamp: getTimestamp(1000 * 60 * 60 * 24 * 1), // Tomorrow
  // },
  // {
  //   id: "23",
  //   type: "deal",
  //   description: "Contract renewal date (next week)",
  //   user: "Alex Wong",
  //   entity: "TechStart Inc.",
  //   timestamp: getTimestamp(1000 * 60 * 60 * 24 * 6), // 6 days in the future
  // },
  // {
  //   id: "24",
  //   type: "task",
  //   description: "Quarterly review (next month)",
  //   user: "Sarah Chen",
  //   entity: "Team performance",
  //   timestamp: getTimestamp(1000 * 60 * 60 * 24 * 30), // ~1 month in the future
  // },
  // {
  //   id: "25",
  //   type: "lead",
  //   description: "Lead follow-up date (next year)",
  //   user: "John Doe",
  //   entity: "Future Prospect Inc.",
  //   timestamp: new Date(new Date().getFullYear() + 1, 1, 15).toISOString(), // Next year, February 15
  // },

  // // === EDGE CASE: INVALID DATE ===
  // // This will be handled by our formatter and shouldn't break the UI
  // {
  //   id: "26",
  //   type: "user",
  //   description: "Activity with invalid date",
  //   user: "System",
  //   timestamp: "invalid-date-format", // Invalid date format to test error handling
  // },
];

// Function to get activity logs (in real app this would likely be an API call)
export function getActivityLogs(): ActivityLog[] {
  return activityLogsMockData;
}
