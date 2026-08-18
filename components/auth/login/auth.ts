import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  } catch (error: any) {
    console.error("Login error:", error);

    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        throw new Error("Incorrect email or password.");
      case "auth/user-not-found":
        throw new Error("No account found with this email.");
      case "auth/invalid-email":
        throw new Error("Invalid email address.");
      case "auth/too-many-requests":
        throw new Error("Too many attempts. Please try again later.");
      default:
        throw new Error("Failed to log in. Please try again.");
    }
  }
}
