"use client";

import { Radio, User, Wand2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    id: "create",
    icon: <Wand2 className="size-4 sm:size-5" />,
    label: "Create",
  },
  {
    id: "feed",
    icon: <Radio className="size-4 sm:size-5" />,
    label: "Feed",
  },
  {
    id: "profile",
    icon: <User className="size-4 sm:size-5" />,
    label: "Profile",
  },
];

const Navbar = () => {
  const path = usePathname();
  const currentPath = path.split("/")[1];
  const defaultSelected =
    currentPath === "podcast" ? "feed" : currentPath || "create";
  const [selected, setSelected] = useState<string>(defaultSelected);

  useEffect(() => {
    const currentPath = path.split("/")[1];
    setSelected(currentPath === "podcast" ? "feed" : currentPath || "create");
  }, [path]);

  return (
    <Dock
      className="fixed bottom-4 left-1/2 -translate-x-1/2"
      direction="middle"
    >
      {navItems.map((item) => (
        <Link key={item.id} href={`/${item.id}`}>
          <DockIcon
            onClick={() => setSelected(item.id)}
            className={cn(
              "cursor-pointer",
              selected === item.id
                ? "text-black bg-white/85"
                : "text-gray-400 hover:text-pink-400"
            )}
          >
            {item.icon}
            {selected === item.id && (
              <span className="text-xs md:text-sm font-medium">
                {item.label}
              </span>
            )}
          </DockIcon>
        </Link>
      ))}
    </Dock>
  );
};

export default Navbar;
