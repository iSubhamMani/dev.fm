"use client"

import { ChevronRight } from 'lucide-react'
import { signIn } from 'next-auth/react';

const LoginButtonSecondary = () => {

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
     <div 
     onClick={handleLogin}
     className="border hover:scale-105 transition-all duration-200 ease-in-out bg-neutral-900 border-white/10 p-2 rounded-md shadow-lg cursor-pointer text-center font-medium items-center fade-pullup-3 text-sm md:text-base text-white">
              <ChevronRight className="inline mr-1 text-pink-400" />
              Continue with GitHub
            </div>
  )
}

export default LoginButtonSecondary