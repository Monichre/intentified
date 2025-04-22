"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function UsersPermissionsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users & Permissions</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings/users/new">
            <Button>
              <Plus className="size-4" />
              New User
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Manage users and their permissions. Add new users, assign roles, and control access to different parts of the system.
          </p>
        </div>
      </div>
    </div>
  );
} 