"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAuthUser } from "@/lib/get-auth-user";
import { useAuthStore } from "@/store/auth.store";

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
  const { setUser, setStatus, clearUser } = useAuthStore();

  useEffect(() => {
    //  console.log("[AuthProvider] mounting, subscribing to onAuthStateChanged");

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        "[AuthProvider] onAuthStateChanged fired:",
        firebaseUser?.uid ?? "no user",
      );

      if (!firebaseUser) {
        //    console.log("[AuthProvider] no firebaseUser -> clearUser()");
        clearUser();
        return;
      }

      try {
        //   console.log(
        //     "[AuthProvider] fetching Firestore doc for uid:",
        //     firebaseUser.uid,
        //   );
        const authUser = await getAuthUser(firebaseUser.uid);
        console.log("[AuthProvider] getAuthUser resolved:", authUser);

        if (!authUser) {
          //    console.log("[AuthProvider] no Firestore doc -> status = onboarding");
          setStatus("onboarding");
          return;
        }

        //   console.log("[AuthProvider] setUser ->", authUser);
        setUser(authUser);
      } catch (err) {
        //   console.error("[AuthProvider] getAuthUser threw an error:", err);
        // Don't leave status stuck on "loading" if this throws
        setStatus("onboarding");
      }
    });

    return () => {
      console.log("[AuthProvider] unmounting, unsubscribing");
      unsubscribe();
    };
  }, [setUser, setStatus, clearUser]);

  return <>{children}</>;
}
