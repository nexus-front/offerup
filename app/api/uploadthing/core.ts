import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import "@/lib/firebase-admin"; // ensures firebase-admin app is initialized
import { getAuth } from "firebase-admin/auth";

const f = createUploadthing();

/**
 * Verifies the Firebase ID token sent from the client so UploadThing
 * knows WHO is uploading. The token must be attached client-side via
 * the `headers` option on useUploadThing — see src/lib/uploadthing/index.ts
 * usage inside the modal components.
 */
async function auth(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    console.error("[uploadthing] No Authorization header on request");
    return null;
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    return { id: decoded.uid };
  } catch (err) {
    console.error("[uploadthing] Failed to verify Firebase ID token:", err);
    return null;
  }
}

export const ourFileRouter = {
  // Used for: profile avatar, seller avatar (single image)
  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { uid: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar uploaded for", metadata.uid, file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Used for: product pictures (multiple images per link)
  productImagesUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 6 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { uid: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image uploaded for", metadata.uid, file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
