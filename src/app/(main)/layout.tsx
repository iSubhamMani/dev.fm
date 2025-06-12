import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-neutral-950/95 bg-[radial-gradient(ellipse_90%_90%_at_50%_-30%,rgba(236,72,153,0.25),rgba(96,130,246,0.25),rgba(255,255,255,0))] text-white relative overflow-hidden">
      {children}
      <Navbar />
    </div>
  );
};

export default MainLayout;
