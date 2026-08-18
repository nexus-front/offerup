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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CreateProfileInput, Profile } from "@/types";

const profilesCol = (uid: string) => collection(db, "users", uid, "profiles");
const profileDoc = (uid: string, profileId: string) =>
  doc(db, "users", uid, "profiles", profileId);
const userDoc = (uid: string) => doc(db, "users", uid);

/**
 * Create a new profile for the user.
 * If this is the user's FIRST profile, it is automatically
 * set as the active profile.
 */
export async function createProfile(
  uid: string,
  input: CreateProfileInput,
): Promise<Profile> {
  const ref = doc(profilesCol(uid)); // auto-generated id

  const profile: Omit<Profile, "createdAt" | "updatedAt"> & {
    createdAt: unknown;
    updatedAt: unknown;
  } = {
    id: ref.id,
    ownerUid: uid,
    name: input.name,
    avatarUrl: input.avatarUrl,
    location: input.location,
    whenJoined: input.whenJoined,
    domain: input.domain,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, profile);

  // If user has no active profile yet, make this one active.
  const userSnap = await getDoc(userDoc(uid));
  const activeProfileId = userSnap.data()?.activeProfileId;
  if (!activeProfileId) {
    await updateDoc(userDoc(uid), { activeProfileId: ref.id });
  }

  return profile as Profile;
}

export async function getProfiles(uid: string): Promise<Profile[]> {
  const q = query(profilesCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Profile);
}

export async function getProfile(
  uid: string,
  profileId: string,
): Promise<Profile | null> {
  const snap = await getDoc(profileDoc(uid, profileId));
  return snap.exists() ? (snap.data() as Profile) : null;
}

export async function updateProfile(
  uid: string,
  profileId: string,
  input: Partial<CreateProfileInput>,
): Promise<void> {
  await updateDoc(profileDoc(uid, profileId), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a profile. If it was the active profile, falls back to
 * the next available profile (or null if none remain).
 */
export async function deleteProfile(
  uid: string,
  profileId: string,
): Promise<void> {
  await deleteDoc(profileDoc(uid, profileId));

  const userSnap = await getDoc(userDoc(uid));
  const activeProfileId = userSnap.data()?.activeProfileId;

  if (activeProfileId === profileId) {
    const remaining = await getProfiles(uid);
    await updateDoc(userDoc(uid), {
      activeProfileId: remaining.length > 0 ? remaining[0].id : null,
    });
  }
}

export async function setActiveProfile(
  uid: string,
  profileId: string,
): Promise<void> {
  await updateDoc(userDoc(uid), { activeProfileId: profileId });
}

export async function getActiveProfileId(
  uid: string,
): Promise<string | null> {
  const snap = await getDoc(userDoc(uid));
  return snap.data()?.activeProfileId ?? null;
}
