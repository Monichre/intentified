import { redirect } from "next/navigation";

export default function IntentHubPage() {
  // Redirect to the dashboard with the intent-hub tab active
  redirect("/dashboard?tab=intent-hub");
}
