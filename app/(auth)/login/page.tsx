//import { AuthGuard } from "@/providers/guards";
import { LoginCard } from "@/components/auth/login/login-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const Login = () => {
  return <LoginCard />;
};

export default Login;
