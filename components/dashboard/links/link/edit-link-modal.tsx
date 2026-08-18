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
import { Loader2, Plus, X } from "lucide-react";
import { useUpdateLink } from "@/hooks/use-links";
import { useUploadThing } from "@/lib/uploadthing";
import { utAuthHeaders } from "@/lib/uploadthing/auth-headers";
import { toast } from "sonner";
import type { Link } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface EditLinkModalProps {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLinkModal({
  link,
  open,
  onOpenChange,
}: EditLinkModalProps) {
  const updateLink = useUpdateLink();

  const [productName, setProductName] = useState(link.productName);
  const [productAmount, setProductAmount] = useState(
    String(link.productAmount),
  );
  const [sellerName, setSellerName] = useState(link.sellerName);
  const [buyerPayment, setBuyerPayment] = useState(link.buyerPayment);

  const [sellerAvatarFile, setSellerAvatarFile] = useState<File | null>(null);
  const [sellerAvatarPreview, setSellerAvatarPreview] = useState<string | null>(
    link.sellerAvatar,
  );

  const [existingPictures, setExistingPictures] = useState<string[]>(
    link.productPictures,
  );
  const [newProductFiles, setNewProductFiles] = useState<File[]>([]);
  const [newProductPreviews, setNewProductPreviews] = useState<string[]>([]);

  const { startUpload: startAvatarUpload, isUploading: uploadingAvatar } =
    useUploadThing("avatarUploader", { headers: utAuthHeaders });
  const {
    startUpload: startProductImagesUpload,
    isUploading: uploadingProducts,
  } = useUploadThing("productImagesUploader", { headers: utAuthHeaders });

  function handleSellerAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSellerAvatarFile(file);
    setSellerAvatarPreview(URL.createObjectURL(file));
  }

  function handleNewProductFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewProductFiles((prev) => [...prev, ...files]);
    setNewProductPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function removeExistingPicture(index: number) {
    setExistingPictures((prev) => prev.filter((_, i) => i !== index));
  }

  function removeNewPicture(index: number) {
    setNewProductFiles((prev) => prev.filter((_, i) => i !== index));
    setNewProductPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (existingPictures.length === 0 && newProductFiles.length === 0) {
      toast.error("At least one product image is required.");
      return;
    }

    try {
      let sellerAvatar = link.sellerAvatar;
      if (sellerAvatarFile) {
        const uploaded = await startAvatarUpload([sellerAvatarFile]);
        if (uploaded?.[0]?.ufsUrl) sellerAvatar = uploaded[0].ufsUrl;
      }

      let productPictures = existingPictures;
      if (newProductFiles.length > 0) {
        const uploaded = await startProductImagesUpload(newProductFiles);
        const newUrls = uploaded?.map((f) => f.ufsUrl) ?? [];
        productPictures = [...existingPictures, ...newUrls];
      }

      await updateLink.mutateAsync({
        linkId: link.id,
        input: {
          productName,
          productAmount: Number(productAmount),
          sellerName,
          buyerPayment: Number(buyerPayment),
          sellerAvatar,
          productPictures,
        },
      });

      toast.success("Link updated.");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update link.");
    }
  }

  const busy = updateLink.isPending || uploadingAvatar || uploadingProducts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[calc(45vw-2rem)] gap-0 px-0 py-5">
        <ScrollArea className="h-[75vh] px-6">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-5">
            <div className="space-y-2">
              <Label>Product images</Label>
              <div className="flex flex-wrap gap-2">
                {existingPictures.map((src, i) => (
                  <div key={`existing-${i}`} className="relative h-20 w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Product ${i}`}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPicture(i)}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {newProductPreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative h-20 w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`New product ${i}`}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPicture(i)}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted">
                  <Plus className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleNewProductFiles}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-productName">Product name</Label>
              <Input
                id="edit-productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-productAmount">Product amount</Label>
              <Input
                id="edit-productAmount"
                type="number"
                step="0.01"
                value={productAmount}
                onChange={(e) => setProductAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-buyerPayment">Buyer payment</Label>
              <Input
                id="edit-buyerPayment"
                value={buyerPayment}
                onChange={(e) => setBuyerPayment(e.target.value)}
              />
            </div>

            <Separator />

            <p className="font-bold mx-auto ">SELLER</p>

            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={sellerAvatarPreview ?? undefined}
                  className="object-cover"
                />
                <AvatarFallback>
                  {sellerName?.[0]?.toUpperCase() ?? "S"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="edit-sellerAvatar" className="mb-1 block">
                  Seller avatar
                </Label>
                <Input
                  id="edit-sellerAvatar"
                  type="file"
                  accept="image/*"
                  onChange={handleSellerAvatarChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sellerName">Seller name</Label>
              <Input
                id="edit-sellerName"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={busy} className="w-full">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>{" "}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
