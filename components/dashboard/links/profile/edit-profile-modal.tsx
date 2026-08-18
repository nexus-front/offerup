"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useProfiles } from "@/hooks/use-profiles";
import { useUploadThing } from "@/lib/uploadthing";
import { utAuthHeaders } from "@/lib/uploadthing/auth-headers";
import { toast } from "sonner";
import type { Profile } from "@/types";

interface EditProfileModalProps {
  profile: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({
  profile,
  open,
  onOpenChange,
}: EditProfileModalProps) {
  const { editProfile } = useProfiles();

  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [whenJoined, setWhenJoined] = useState(profile.whenJoined);
  const [domain, setDomain] = useState(profile.domain);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatarUrl,
  );

  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    headers: utAuthHeaders,
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      let avatarUrl = profile.avatarUrl;
      if (avatarFile) {
        const uploaded = await startUpload([avatarFile]);
        if (uploaded?.[0]?.ufsUrl) avatarUrl = uploaded[0].ufsUrl;
      }

      await editProfile(profile.id, {
        name,
        location,
        whenJoined,
        domain,
        avatarUrl,
      });

      toast.success("Profile updated.");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatarPreview ?? undefined}
                className="object-cover"
              />
              <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="edit-avatar" className="mb-1 block">
                Avatar
              </Label>
              <Input
                id="edit-avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-whenJoined">When joined</Label>
            <Input
              id="edit-whenJoined"
              value={whenJoined}
              onChange={(e) => setWhenJoined(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-domain">Domain</Label>
            <Input
              id="edit-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={busy} className="w-full">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
