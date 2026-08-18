"use client";

import { CreateLinkModal } from "@/components/dashboard/links/link/create-link-modal2";
//import { CreateLinkModal } from "@/components/dashboard/links/link/create-link-modal";
import { LinksTable } from "@/components/dashboard/links/link/links-table";
import { ActiveProfileButton } from "@/components/dashboard/links/profile/active-profile-button";
import { CreateProfileModal } from "@/components/dashboard/links/profile/create-profile-modal";
import { ProfilesProvider } from "@/hooks/use-profiles";

export default function DashboardPage() {
  return (
    <ProfilesProvider>
      <div className="mx-auto ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Links</h1>
          <div className="flex items-center gap-2">
            <CreateProfileModal />
            <ActiveProfileButton />
          </div>
        </div>

        <div className="rounded-lg border p-6 my-5">
          <p className="mb-4 text-sm text-muted-foreground">
            Create a link under your currently active profile.
          </p>
          <CreateLinkModal />
        </div>

        {/* Links table goes here later */}
        <LinksTable />
      </div>
    </ProfilesProvider>
  );
}
