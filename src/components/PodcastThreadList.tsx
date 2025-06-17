"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "convex/react";
import { PanelRight } from "lucide-react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

const PodcastThreadList = ({ userId }: { userId: string }) => {
  const drafts = useQuery(api.podcasts.queries.getAllDrafts, {
    userId,
  });

  return (
    <div className="flex justify-start w-full realtive">
      <Sheet>
        <SheetTrigger className="text-sm group text-white cursor-pointer flex items-center gap-2 absolute top-6 left-6">
          Drafts{" "}
          <PanelRight className="size-4 transition-transform group-hover:translate-x-1" />
        </SheetTrigger>
        <SheetContent side="left" className="bg-neutral-900">
          <SheetHeader>
            <SheetTitle className="text-white">Your Drafts</SheetTitle>
          </SheetHeader>
          <div>
            {drafts &&
              drafts.length > 0 &&
              drafts.map((draft) => (
                <Link href={`/create/${draft._id}`} key={draft._id}>
                  <div className="p-4 space-y-2 border-b border-neutral-700 hover:bg-gradient-to-br from-neutral-800 to-neutral-800/40 transition-colors cursor-pointer">
                    <p className="text-white text-sm font-semibold">
                      {draft.title || "Untitled Draft"}
                    </p>
                    <p className="text-neutral-400 text-xs">
                      {draft.idea
                        ? draft.idea.slice(0, 100) + "..."
                        : "No idea provided"}
                    </p>
                    <p className="text-neutral-300 text-xs">
                      Created on:{" "}
                      {new Date(draft._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PodcastThreadList;
