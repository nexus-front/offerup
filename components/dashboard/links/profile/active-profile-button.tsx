"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useProfiles } from "@/hooks/use-profiles";

import { useState } from "react";
import { ProfileSwitcherModal } from "./profile-switcher-modal";

export function ActiveProfileButton() {
  const { activeProfile, profiles } = useProfiles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 p-3"
        onClick={() => setOpen(true)}
        disabled={profiles.length === 0}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={activeProfile?.avatarUrl}
            className="object-cover"
          />
          <AvatarFallback>
            {activeProfile?.name?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[120px] truncate">
          {activeProfile?.name ?? "No profile"}
        </span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </Button>

      <ProfileSwitcherModal open={open} onOpenChange={setOpen} />
    </>
  );
}
