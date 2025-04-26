import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
	throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}

// Likely don't want to do this in production, we use the admin client to create documents and tasks.
// Using admin here is just to get around forcing users to authenticate before using the preview
export const supabaseAdminClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_API_KEY || "",
	{
		auth: { persistSession: false },
	},
);
