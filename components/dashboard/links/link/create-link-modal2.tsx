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
import { Loader2, Plus, X } from "lucide-react";
import { useProfiles } from "@/hooks/use-profiles";
import { useCreateLink } from "@/hooks/use-links";
import { useUploadThing } from "@/lib/uploadthing";
import { utAuthHeaders } from "@/lib/uploadthing/auth-headers";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CreateLinkModalProps {
  trigger?: React.ReactNode;
}

export function CreateLinkModal({ trigger }: CreateLinkModalProps) {
  const { activeProfile } = useProfiles();
  const createLink = useCreateLink();

  const [open, setOpen] = useState(false);

  const [productName, setProductName] = useState("");
  const [productAmount, setProductAmount] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [buyerPayment, setBuyerPayment] = useState("");

  const [sellerAvatarFile, setSellerAvatarFile] = useState<File | null>(null);
  const [sellerAvatarPreview, setSellerAvatarPreview] = useState<string | null>(
    null,
  );

  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);

  const { startUpload: startAvatarUpload, isUploading: uploadingAvatar } =
    useUploadThing("avatarUploader", { headers: utAuthHeaders });
  const {
    startUpload: startProductImagesUpload,
    isUploading: uploadingProducts,
  } = useUploadThing("productImagesUploader", { headers: utAuthHeaders });

  function resetForm() {
    setProductName("");
    setProductAmount("");
    setSellerName("");
    setBuyerPayment("");
    setSellerAvatarFile(null);
    setSellerAvatarPreview(null);
    setProductFiles([]);
    setProductPreviews([]);
  }

  function handleSellerAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSellerAvatarFile(file);
    setSellerAvatarPreview(URL.createObjectURL(file));
  }

  function handleProductFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setProductFiles((prev) => [...prev, ...files]);
    setProductPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function removeProductImage(index: number) {
    setProductFiles((prev) => prev.filter((_, i) => i !== index));
    setProductPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!activeProfile) {
      toast.error("Select or create a profile first.");
      return;
    }
    if (
      !productName ||
      !productAmount ||
      !sellerName ||
      !buyerPayment ||
      productFiles.length === 0
    ) {
      toast.error("Please fill in all fields and add at least one image.");
      return;
    }

    try {
      // Upload seller avatar (optional — falls back to active profile avatar)
      let sellerAvatarUrl = activeProfile.avatarUrl;
      if (sellerAvatarFile) {
        const uploaded = await startAvatarUpload([sellerAvatarFile]);
        if (uploaded?.[0]?.ufsUrl) sellerAvatarUrl = uploaded[0].ufsUrl;
      }

      // Upload product images
      const uploadedProductImages =
        await startProductImagesUpload(productFiles);
      const productPictures = uploadedProductImages?.map((f) => f.ufsUrl) ?? [];

      if (productPictures.length === 0) {
        throw new Error("Product image upload failed.");
      }

      // useCreateLink prepends the new link to the react-query cache
      // on success, so it shows up at the top of the table immediately.
      await createLink.mutateAsync({
        productName,
        productPictures,
        productAmount: Number(productAmount),
        sellerAvatar: sellerAvatarUrl,
        sellerName,
        buyerPayment: Number(buyerPayment),
      });

      toast.success("Link created!");
      resetForm();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create link.");
    }
  }

  const busy = createLink.isPending || uploadingAvatar || uploadingProducts;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="min-w-[calc(45vw-2rem)] gap-0 px-0 py-5">
        <ScrollArea className="h-[75vh] px-6">
          <DialogHeader>
            <DialogTitle>Create Link</DialogTitle>
            <DialogDescription>
              Creating under profile{" "}
              <span className="font-medium">
                {activeProfile?.name ?? "None selected"}
              </span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-5">
            <div className="space-y-2">
              <Label>Product images</Label>
              <div className="flex flex-wrap gap-2">
                {productPreviews.map((src, i) => (
                  <div key={i} className="relative h-20 w-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Product ${i}`}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeProductImage(i)}
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
                    onChange={handleProductFilesChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productAmount">Product amount</Label>
              <Input
                id="productAmount"
                type="number"
                value={productAmount}
                onChange={(e) => setProductAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerPayment">Buyer payment</Label>
              <Input
                id="buyerPayment"
                type="number"
                value={buyerPayment}
                onChange={(e) => setBuyerPayment(e.target.value)}
                placeholder="e.g 240"
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
                <Label htmlFor="sellerAvatar" className="mb-1 block">
                  Seller avatar
                </Label>
                <Input
                  id="sellerAvatar"
                  type="file"
                  accept="image/*"
                  onChange={handleSellerAvatarChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellerName">Seller name</Label>
              <Input
                id="sellerName"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={busy} className="w-full">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Link
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
