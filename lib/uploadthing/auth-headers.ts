import { auth } from "@/lib/firebase";

/**
 * Pass this into every useUploadThing(...) call's second argument as
 * `{ headers: utAuthHeaders }`. It attaches the current user's Firebase
 * ID token so the server-side middleware in core.ts can verify who's
 * uploading. Without this, every upload request 500s with "Unauthorized".
 */
export async function utAuthHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return {
    authorization: token ? `Bearer ${token}` : "",
  };
}
