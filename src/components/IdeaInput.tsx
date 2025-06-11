/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ShineBorder } from "@/components/magicui/shine-border";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import ImportFromGithub from "@/components/ImportFromGithub";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import { error } from "@/utils/sonnerStyles";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LuLoaderCircle } from "react-icons/lu";

const IdeaInput = ({ session }: { session: Session }) => {
  const [idea, setIdea] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const createPodcast = useMutation(api.podcasts.mutations.createPodcast);

  const handleCreate = async () => {
    if (!idea.trim() || idea.trim().length < 400) {
      setToastMessage(
        "Please provide a valid idea with at least 400 characters."
      );
      toast.error(toastMessage, {
        duration: 3000,
        position: "top-center",
        style: error,
      });
      return;
    }

    try {
      setLoading(true);
      const podcastId = await createPodcast({
        idea: idea.trim(),
        userId: session.userId,
        status: "draft",
      });

      console.log("Created podcast with ID:", podcastId);
      setIdea("");
    } catch (e: any) {
      console.error("Error creating podcast:", e);
      setToastMessage(
        "An error occurred while creating the podcast. Please try again."
      );
      toast.error(toastMessage, {
        duration: 3000,
        position: "top-center",
        style: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-4 max-w-2xl w-full rounded-md relative border border-neutral-600 bg-neutral-900">
      <ShineBorder shineColor={["#e60076", "#7c86ff", "#fb64b6"]} />
      <Textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your idea here..."
        className="h-52 overflow-y-auto w-full focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-lg placeholder:text-sm md:placeholder:text-lg placeholder:text-neutral-500"
        style={{ resize: "none" }}
      />
      <div className="flex items-center justify-end mt-4 gap-4">
        <ImportFromGithub accessToken={session?.accessToken} />
        <Button
          disabled={loading}
          onClick={handleCreate}
          className="cursor-pointer bg-neutral-800 border border-transparent hover:border-pink-300 text-white text-xs transition-all duration-200 ease-in-out"
        >
          {loading ? (
            <span>
              <LuLoaderCircle className="animate-spin size-4" />
            </span>
          ) : (
            <span className="flex items-center">
              Generate Script
              <ChevronRight className="ml-1 size-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default IdeaInput;
