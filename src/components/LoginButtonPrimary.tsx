"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";

const LoginButtonPrimary = () => {
  const handleLogin = async () => {
    try {
      const res = await signIn("github", { callbackUrl: "/create" });
      if (res?.error) {
        console.error("Login error:", res.error);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="bg-white font-medium cursor-pointer text-black hover:bg-white/90 px-4 py-3 md:px-8 md:py-6 text-xs md:text-sm shadow-lg shadow-pink-600 transition-all duration-300 hover:scale-105"
    >
      <FaGithub className="size-5" />
      Login
    </Button>
  );
};

export default LoginButtonPrimary;
