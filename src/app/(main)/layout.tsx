import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gradient-to-r from-neutral-800 via-neutral-900 to-black text-white relative overflow-hidden">
      {children}
      <Navbar />
    </div>
  );
};

export default MainLayout;
