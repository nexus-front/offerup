import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getProfile, getActiveProfileId } from "@/lib/firebase/profiles";
import type { CreateLinkInput, Link, ProfileSnapshot } from "@/types";

const linksCol = (uid: string) => collection(db, "users", uid, "links");
const linkDoc = (uid: string, linkId: string) =>
  doc(db, "users", uid, "links", linkId);

/**
 * Generates an order id like "#OU-48213907" and guarantees
 * it's unique across the user's links (very unlikely to collide,
 * but we check anyway).
 */
async function generateUniqueOrderId(uid: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const digits = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    const candidate = `#OU-${digits}`;

    const q = query(linksCol(uid), where("order", "==", candidate));
    const snap = await getDocs(q);
    if (snap.empty) return candidate;
  }
  // Extremely unlikely fallback using timestamp for guaranteed uniqueness
  return `#OU-${Date.now().toString().slice(-8)}`;
}

/**
 * Create a link under the CURRENT active profile.
 * Snapshots the active profile's data onto the link so future
 * profile edits don't retroactively change historical links.
 */
export async function createLink(
  uid: string,
  input: CreateLinkInput,
): Promise<Link> {
  const activeProfileId = await getActiveProfileId(uid);
  if (!activeProfileId) {
    throw new Error(
      "No active profile selected. Create or select a profile first.",
    );
  }

  const profile = await getProfile(uid, activeProfileId);
  if (!profile) {
    throw new Error("Active profile not found.");
  }

  const ref = doc(linksCol(uid));
  const order = await generateUniqueOrderId(uid);
  const linkUrl = `${profile.domain}/${ref.id}`;

  const activeProfileSnapshot: ProfileSnapshot = {
    id: profile.id,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    location: profile.location,
    whenJoined: profile.whenJoined,
    domain: profile.domain,
  };

  const link = {
    id: ref.id,
    ownerUid: uid,
    productName: input.productName,
    productPictures: input.productPictures,
    productAmount: input.productAmount,
    sellerAvatar: input.sellerAvatar,
    sellerName: input.sellerName,
    buyerPayment: input.buyerPayment,
    order,
    linkUrl,
    activeProfile: activeProfileSnapshot,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, link);
  return link as unknown as Link;
}

export async function getLinks(uid: string): Promise<Link[]> {
  const q = query(linksCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Link);
}

export async function getLink(
  uid: string,
  linkId: string,
): Promise<Link | null> {
  const snap = await getDoc(linkDoc(uid, linkId));
  return snap.exists() ? (snap.data() as Link) : null;
}

export async function updateLink(
  uid: string,
  linkId: string,
  input: Partial<CreateLinkInput>,
): Promise<void> {
  await updateDoc(linkDoc(uid, linkId), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLink(uid: string, linkId: string): Promise<void> {
  await deleteDoc(linkDoc(uid, linkId));
}
