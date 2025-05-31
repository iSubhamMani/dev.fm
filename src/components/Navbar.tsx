"use client";
import { Radio, User, Wand2 } from "lucide-react";
import React, { useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";

const Navbar = () => {
  return (
    <Dock
      className="fixed bottom-4 left-1/2 -translate-x-1/2"
      direction="middle"
    >
      {" "}
      <DockIcon className="hover:text-pink-400">
        {" "}
        <Wand2 className="size-4 sm:size-5" />{" "}
      </DockIcon>{" "}
      <DockIcon className="hover:text-pink-400">
        {" "}
        <Radio className="size-4 sm:size-5" />{" "}
      </DockIcon>{" "}
      <DockIcon className="hover:text-pink-400">
        {" "}
        <User className="size-4 sm:size-5" />{" "}
      </DockIcon>{" "}
    </Dock>
  );
};

export default Navbar;
