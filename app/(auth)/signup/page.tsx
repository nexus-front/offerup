//import { AuthGuard } from "@/providers/guards";
import { SignupCard } from "@/components/auth/signup/signup-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

const Signup = () => {
  return <SignupCard />;
};

export default Signup;
