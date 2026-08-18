// lib/get-auth-user.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AuthUser } from "@/store/auth.store";

// Fetches user document from Firestore and maps it to AuthUser
// Returns null if the document doesn't exist (new user, needs onboarding)
export async function getAuthUser(uid: string): Promise<AuthUser | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));

    if (!snap.exists()) return null;

    const d = snap.data();

    // Map Firestore Timestamps to ISO strings for Zustand serialisability
    return {
      uid: d.uid,
      name: d.name ?? "",
      role: d.role ?? "user",
      avatarUrl: d.avatarUrl,
      createdAt: d.createdAt?.toDate?.()?.toISOString() ?? "",
    };
  } catch (error) {
    console.error("[getAuthUser] Failed to fetch user:", error);
    return null;
  }
}
