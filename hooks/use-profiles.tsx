"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser } from "@/store/auth.store";
import {
  createProfile as createProfileFirebase,
  deleteProfile as deleteProfileFirebase,
  getProfiles,
  setActiveProfile as setActiveProfileFirebase,
  updateProfile as updateProfileFirebase,
} from "@/lib/firebase/profiles";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CreateProfileInput, Profile } from "@/types";

interface ProfilesContextValue {
  profiles: Profile[];
  activeProfile: Profile | null;
  activeProfileId: string | null;
  loading: boolean;
  refreshProfiles: () => Promise<void>;
  createProfile: (input: CreateProfileInput) => Promise<Profile>;
  editProfile: (
    profileId: string,
    input: Partial<CreateProfileInput>,
  ) => Promise<void>;
  removeProfile: (profileId: string) => Promise<void>;
  switchActiveProfile: (profileId: string) => Promise<void>;
}

const ProfilesContext = createContext<ProfilesContextValue | undefined>(
  undefined,
);

export function ProfilesProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const uid = user?.uid;

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfiles = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    const list = await getProfiles(uid);
    setProfiles(list);
    setLoading(false);
  }, [uid]);

  // Load profiles once we have a resolved uid from the auth store
  useEffect(() => {
    if (uid) refreshProfiles();
    else {
      setProfiles([]);
      setActiveProfileId(null);
    }
  }, [uid, refreshProfiles]);

  // Live-listen to the user doc for activeProfileId changes
  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(doc(db, "users", uid), (snap) => {
      setActiveProfileId(snap.data()?.activeProfileId ?? null);
    });
    return () => unsub();
  }, [uid]);

  const createProfile = useCallback(
    async (input: CreateProfileInput) => {
      if (!uid) throw new Error("Not authenticated");
      const profile = await createProfileFirebase(uid, input);
      await refreshProfiles();
      return profile;
    },
    [uid, refreshProfiles],
  );

  const editProfile = useCallback(
    async (profileId: string, input: Partial<CreateProfileInput>) => {
      if (!uid) throw new Error("Not authenticated");
      await updateProfileFirebase(uid, profileId, input);
      await refreshProfiles();
    },
    [uid, refreshProfiles],
  );

  const removeProfile = useCallback(
    async (profileId: string) => {
      if (!uid) throw new Error("Not authenticated");
      await deleteProfileFirebase(uid, profileId);
      await refreshProfiles();
    },
    [uid, refreshProfiles],
  );

  const switchActiveProfile = useCallback(
    async (profileId: string) => {
      if (!uid) throw new Error("Not authenticated");
      await setActiveProfileFirebase(uid, profileId);
    },
    [uid],
  );

  // Active profile always sorted to the top of the list
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.id === activeProfileId) return -1;
    if (b.id === activeProfileId) return 1;
    return 0;
  });

  const activeProfile =
    sortedProfiles.find((p) => p.id === activeProfileId) ?? null;

  return (
    <ProfilesContext.Provider
      value={{
        profiles: sortedProfiles,
        activeProfile,
        activeProfileId,
        loading,
        refreshProfiles,
        createProfile,
        editProfile,
        removeProfile,
        switchActiveProfile,
      }}
    >
      {children}
    </ProfilesContext.Provider>
  );
}

export function useProfiles() {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error("useProfiles must be used within ProfilesProvider");
  return ctx;
}
