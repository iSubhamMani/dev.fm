"use client";

import { Podcast } from "@/models/Podcast";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import ReviewScript from "@/components/ReviewScript";
import { useSession } from "next-auth/react";
import { LuLoaderCircle } from "react-icons/lu";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CreatePodcastDetails = () => {
  const { data: session } = useSession();
  const { id: podcastId } = useParams<{ id: string }>();
  const data = useQuery(api.podcasts.queries.getPodcastById, {
    podcastId: podcastId as Id<"podcasts">,
  });

  const createScriptAgentThreadAction = useAction(
    api.agents.createScriptAgentThread
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const isLoading = data === undefined;
  const notFound = data === null;

  const podcastDetails = data as Podcast | null;

  useEffect(() => {
    async function healthCheck() {
      try {
        await fetch("https://dev-fm.onrender.com");
      } catch (error) {
        console.error("Health check failed:", error);
      }
    }
    healthCheck();
  }, []);

  useEffect(() => {
    const generateScript = async () => {
      if (
        session &&
        podcastDetails &&
        podcastDetails.status === "draft" &&
        !podcastDetails.scriptGenerated &&
        !podcastDetails.threadId &&
        !isGenerating
      ) {
        setIsGenerating(true);
        try {
          await createScriptAgentThreadAction({
            prompt: podcastDetails.idea,
            userId: session.userId,
            threadId: undefined,
            podcastId: podcastId as Id<"podcasts">,
            scriptGenerated: true,
          });
        } catch (err) {
          console.error("Script generation failed:", err);
        } finally {
          setIsGenerating(false);
        }
      }
    };

    generateScript();
  }, [session, podcastDetails]);

  // Global loader
  if (
    !session ||
    !session.userId ||
    isLoading ||
    isGenerating ||
    (!isGenerating &&
      podcastDetails &&
      podcastDetails.status === "draft" &&
      !podcastDetails.threadId)
  ) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[radial-gradient(ellipse_90%_90%_at_50%_-30%,rgba(236,72,153,0.25),rgba(96,130,246,0.25),rgba(255,255,255,0))] bg-neutral-950/95 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/40 shadow-2xl px-6 py-5 rounded-2xl border border-pink-300/70 backdrop-blur-md flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          >
            <LuLoaderCircle className="h-6 w-6 text-pink-400" />
          </motion.div>
          <p className="text-sm text-white font-medium animate-pulse">
            {isGenerating ? "Generating script..." : "Fetching details..."}
          </p>
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950/95 text-white">
        <p>Podcast not found.</p>
      </div>
    );
  }

  // ✅ Once everything is ready
  return (
    podcastDetails?.scriptGenerated &&
    podcastDetails.threadId && (
      <ReviewScript
        podcastDetails={podcastDetails}
        threadId={podcastDetails.threadId}
        uid={session.userId}
        avatar={session.user?.image || ""}
      />
    )
  );
};

export default CreatePodcastDetails;
