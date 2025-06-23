"use client";

import { Radio, User, Wand2 } from "lucide-react";
import React, { useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { cn } from "@/lib/utils";

enum NavItem {
  Create = "create",
  Feed = "feed",
  Profile = "profile",
}

const navItems = [
  {
    id: NavItem.Create,
    icon: <Wand2 className="size-4 sm:size-5" />,
    label: "Create",
  },
  {
    id: NavItem.Feed,
    icon: <Radio className="size-4 sm:size-5" />,
    label: "Feed",
  },
  {
    id: NavItem.Profile,
    icon: <User className="size-4 sm:size-5" />,
    label: "Profile",
  },
];

const Navbar = () => {
  const [selected, setSelected] = useState<NavItem>(NavItem.Create);

  return (
    <Dock
      className="fixed bottom-4 left-1/2 -translate-x-1/2"
      direction="middle"
    >
      {navItems.map((item) => (
        <DockIcon
          key={item.id}
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
            <span className="text-xs md:text-sm font-medium">{item.label}</span>
          )}
        </DockIcon>
      ))}
    </Dock>
  );
};

export default Navbar;
