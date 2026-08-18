import { collectionGroup, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Link } from "@/types";

/**
 * Fetches a single link by its id, regardless of which user owns it.
 * Used on the public "receive payment" page, where we only have the
 * linkId from the URL — not the owner's uid.
 *
 * Requires the Firestore rule:
 *   match /{path=**}/links/{linkId} {
 *     allow read: if true;
 *   }
 *
 * IMPORTANT: collectionGroup() queries with a where() filter need a
 * dedicated Firestore index. The FIRST time this runs, Firestore will
 * throw a "failed-precondition" error containing a direct link to
 * auto-create that index in the console. Check your browser console
 * for that error/link if this keeps returning null.
 */
export async function getLinkPublic(linkId: string): Promise<Link | null> {
  try {
    const q = query(collectionGroup(db, "links"), where("id", "==", linkId));
    const snap = await getDocs(q);

    //  console.log("[getLinkPublic] linkId:", linkId, "docs found:", snap.size);

    if (snap.empty) return null;
    return snap.docs[0].data() as Link;
  } catch (err) {
    // Don't swallow this — Firestore errors here are almost always
    // either a missing collection-group index or a rules issue, and
    // both come with actionable info in `err`.
    //   console.error("[getLinkPublic] Firestore query failed:", err);
    throw err;
  }
}
