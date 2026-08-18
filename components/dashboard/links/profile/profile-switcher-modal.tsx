"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useProfiles } from "@/hooks/use-profiles";

import { toast } from "sonner";
import type { Profile } from "@/types";
import { CreateProfileModal } from "./create-profile-modal";
import { EditProfileModal } from "./edit-profile-modal";

interface ProfileSwitcherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSwitcherModal({
  open,
  onOpenChange,
}: ProfileSwitcherModalProps) {
  const { profiles, activeProfileId, switchActiveProfile, removeProfile } =
    useProfiles();
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  async function handleSwitch(profileId: string) {
    if (profileId === activeProfileId) return;
    try {
      await switchActiveProfile(profileId);
      toast.success("Active profile switched.");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to switch profile.");
    }
  }

  async function handleDelete(profileId: string) {
    try {
      await removeProfile(profileId);
      toast.success("Profile deleted.");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to delete profile.");
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Profiles</DialogTitle>
            <DialogDescription>Switch Profiles here</DialogDescription>
          </DialogHeader>

          <div className="max-h-80 space-y-2 overflow-y-auto">
            {profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              return (
                <div
                  key={profile.id}
                  className={`flex items-center justify-between rounded-lg border p-2 ${
                    isActive ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <button
                    onClick={() => handleSwitch(profile.id)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={profile.avatarUrl}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {profile.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {profile.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {profile.location}
                      </span>
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="ml-2">
                        Active
                      </Badge>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingProfile(profile)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete profile?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{profile.name}". This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(profile.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}

            {profiles.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No profiles yet. Create one to get started.
              </p>
            )}
          </div>

          <CreateProfileModal
            trigger={
              <Button variant="outline" className="w-full">
                + Create another profile
              </Button>
            }
          />
        </DialogContent>
      </Dialog>

      {editingProfile && (
        <EditProfileModal
          profile={editingProfile}
          open={!!editingProfile}
          onOpenChange={(open) => !open && setEditingProfile(null)}
        />
      )}
    </>
  );
}
