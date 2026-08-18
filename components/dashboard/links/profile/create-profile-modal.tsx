"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Plus } from "lucide-react";
import { useProfiles } from "@/hooks/use-profiles";
import { useUploadThing } from "@/lib/uploadthing";
import { utAuthHeaders } from "@/lib/uploadthing/auth-headers";
import { toast } from "sonner";

interface CreateProfileModalProps {
  trigger?: React.ReactNode;
}

export function CreateProfileModal({ trigger }: CreateProfileModalProps) {
  const { createProfile } = useProfiles();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [whenJoined, setWhenJoined] = useState("");
  const [domain, setDomain] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("avatarUploader", {
    headers: utAuthHeaders,
  });

  function resetForm() {
    setName("");
    setLocation("");
    setWhenJoined("");
    setDomain("");
    setAvatarFile(null);
    setAvatarPreview(null);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !location || !whenJoined || !domain) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      let avatarUrl = "https://i.postimg.cc/fTkF2P9H/download.jpg"; // default placeholder

      if (avatarFile) {
        const uploaded = await startUpload([avatarFile]);
        if (uploaded?.[0]?.ufsUrl) avatarUrl = uploaded[0].ufsUrl;
      }

      await createProfile({ name, location, whenJoined, domain, avatarUrl });

      toast.success("Profile created!");
      resetForm();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create profile.");
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || isUploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Profile
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatarPreview ?? undefined}
                className="object-cover"
              />
              <AvatarFallback>{name?.[0]?.toUpperCase() ?? "P"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatar" className="mb-1 block">
                Avatar
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John michael"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New york, usa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whenJoined">When joined</Label>
            <Input
              id="whenJoined"
              value={whenJoined}
              onChange={(e) => setWhenJoined(e.target.value)}
              placeholder="e.g. Joined March 2021"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. myshop.com"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={busy} className="w-full">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
