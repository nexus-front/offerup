import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Sign up with email and password.
// Firebase automatically keeps the user logged in after this call.
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;

    await updateProfile(user, { displayName: fullName });

    // Create the user doc in Firestore — just id + username, nothing else.
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullName,
      role: "user",
      avatarUrl: "https://i.postimg.cc/fTkF2P9H/download.jpg",
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (error: any) {
    console.error("Signup error:", error);

    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error(
          "This email is already registered. Please sign in instead.",
        );
      case "auth/weak-password":
        throw new Error(
          "Password is too weak. Please use a stronger password.",
        );
      case "auth/invalid-email":
        throw new Error("Invalid email address.");
      default:
        throw new Error("Failed to create account. Please try again.");
    }
  }
}
