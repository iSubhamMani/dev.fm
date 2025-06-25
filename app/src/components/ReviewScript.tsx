"use client";

import { RiSendPlaneLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Podcast } from "@/models/Podcast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LuLoaderCircle } from "react-icons/lu";
import { RiRobot2Fill } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WordRotate } from "./magicui/word-rotate";
import { Id } from "../../convex/_generated/dataModel";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";
import { toast } from "sonner";
import { error, success } from "@/utils/sonnerStyles";
import { useDebounce } from "use-debounce";
import { isEqual } from "lodash";
import { getRelativeTime } from "@/utils/formatTime";
import GeneratePodcastDialog from "./GeneratePodcastDialog";
import PublishPodcastDialog from "./PublishPodcastDialog";
import UpdatePodcastDialog from "./UpdatePodcastDialog";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Episode {
  episode: number;
  title: string;
  script: string;
}

const ReviewScript = ({
  podcastDetails,
  threadId,
  uid,
  avatar,
}: {
  podcastDetails: Podcast;
  threadId: string;
  uid: string;
  avatar: string;
}) => {
  const [script, setScript] = useState<Episode[]>(
    podcastDetails?.episodes || []
  );
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [updating, setUpdating] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [debouncedScript] = useDebounce(script, 1000);
  const [generatingChanges, setGeneratingChanges] = useState(false);
  const previousScriptRef = useRef<Episode[] | null>(null);
  const hasMounted = useRef(false);
  const createScriptAgentThreadAction = useAction(
    api.agents.createScriptAgentThread
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your script assistant. I can help you refine your podcast script. Please describe the changes you want to make.",
    },
  ]);
  const updateAction = useMutation(api.podcasts.mutations.updatePodcast);

  const hasAllAudioUrls = useMemo(
    () => podcastDetails?.episodes?.every((ep) => ep.audioUrl),
    [podcastDetails]
  );

  const isPublished = useMemo(
    () => podcastDetails?.status === "published",
    [podcastDetails]
  );

  const handleScriptChange = (episodeNumber: number, newValue: string) => {
    setScript((prev) =>
      prev.map((ep) =>
        ep.episode === episodeNumber ? { ...ep, script: newValue } : ep
      )
    );
  };

  const askScriptAgent = async () => {
    if (!userPrompt.trim()) {
      return;
    }
    setChatMessages((prev) => [...prev, { role: "user", content: userPrompt }]);

    try {
      setGeneratingChanges(true);
      const { toolResults } = await createScriptAgentThreadAction({
        prompt: userPrompt,
        userId: uid,
        threadId,
        podcastId: podcastDetails._id as Id<"podcasts">,
      });

      setUserPrompt("");
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: toolResults?.explanation || "No changes made.",
        },
      ]);
    } catch (error) {
      console.error("Error generating script changes:", error);
    } finally {
      setGeneratingChanges(false);
    }
  };

  useEffect(() => {
    if (!isPublished && hasAllAudioUrls) {
      toast.success("Your podcast is ready for publishing!", {
        style: success,
        duration: 3000,
        position: "top-center",
      });
    }
  }, [isPublished, hasAllAudioUrls]);

  useEffect(() => {
    setScript(podcastDetails?.episodes || []);
  }, [podcastDetails.episodes]);

  // Auto-save script changes

  const saveChanges = useCallback(async () => {
    try {
      setUpdating(true);
      await updateAction({
        id: podcastDetails._id as Id<"podcasts">,
        episodes: debouncedScript,
      });
    } catch {
      toast.error("Failed to save changes. Try again.", {
        style: error,
      });
    } finally {
      setUpdating(false);
    }
  }, [podcastDetails._id, debouncedScript]);

  useEffect(() => {
    if (!podcastDetails._id || !debouncedScript) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      previousScriptRef.current = debouncedScript;
      return;
    }

    if (!isEqual(previousScriptRef.current, debouncedScript)) {
      previousScriptRef.current = debouncedScript;
      saveChanges();
    }
  }, [saveChanges]);

  return (
    <div
      className={`h-screen bg-[radial-gradient(ellipse_90%_90%_at_50%_-30%,rgba(236,72,153,0.25),rgba(96,130,246,0.25),rgba(255,255,255,0))] flex bg-neutral-950/95 relative overflow-hidden text-white`}
    >
      <section className="w-full flex flex-col">
        <div className="flex-1 flex flex-col overflow-y-auto border border-neutral-600 shadow-lg bg-neutral-900/60 backdrop-blur-sm text-white p-4">
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-4 pb-6 pt-2">
            {chatMessages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={` flex items-start gap-2 w-full max-w-md text-white ${message.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  {message.role === "assistant" ? (
                    <RiRobot2Fill className="size-4 text-blue-300" />
                  ) : (
                    <Avatar>
                      <AvatarImage src={avatar} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`shadow-md border border-neutral-800 flex-1 bg-neutral-950/45 p-4 rounded-b-xl ${message.role === "user" ? "rounded-tl-xl" : "rounded-tr-xl"}`}
                  >
                    <p className="mt-1 ">{message.content}</p>
                  </div>
                </div>
              );
            })}
            {generatingChanges && (
              <div className="w-max flex items-center gap-2 ">
                <RiRobot2Fill className="size-4 text-blue-300" />
                <WordRotate
                  className="text-sm text-white font-medium animate-pulse"
                  words={[
                    "Analyzing your input...",
                    "Generating changes...",
                    "Refining your script...",
                  ]}
                  duration={3000}
                />
              </div>
            )}
          </div>
          <div className="flex items-start">
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full h-32 bg-neutral-800 shadow-lg"
              style={{ resize: "none" }}
              placeholder="Describe changes"
            />
            <Button
              disabled={generatingChanges}
              onClick={askScriptAgent}
              className="shadow-lg cursor-pointer ml-2 p-3 bg-neutral-800 border border-transparent hover:border-pink-300 text-white transition-all duration-200 ease-in-out"
            >
              <RiSendPlaneLine className="size-5" />
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-neutral-900/60 relative w-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between text-white shadow-lg">
          <button
            className="group cursor-pointer px-6 h-full disabled:pointer-events-none disabled:text-neutral-500 hover:bg-gradient-to-r from-neutral-900/90 to-transparent transition-colors"
            disabled={currentEpisode === 0}
            onClick={() => setCurrentEpisode((prev) => Math.max(prev - 1, 0))}
          >
            <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-3 text-center py-3">
            <h1 className="text-sm text-center font-bold">
              Episode {currentEpisode + 1}
            </h1>
            <p className="text-xs text-neutral-300">
              {script[currentEpisode].title}
            </p>
            <div className="flex justify-center items-center">
              <p className="text-sm text-neutral-400 flex items-center">
                <Dot
                  className={`${updating ? "text-yellow-500" : "text-green-500"} size-8`}
                />
                {updating
                  ? "Saving changes..."
                  : `Last edited ${getRelativeTime(podcastDetails.updatedAt)}`}
              </p>
            </div>
          </div>
          <button
            className="group cursor-pointer disabled:pointer-events-none disabled:text-neutral-500 px-6 h-full hover:bg-gradient-to-l from-neutral-900/90 to-transparent transition-colors"
            disabled={currentEpisode + 1 === script.length}
            onClick={() => setCurrentEpisode((prev) => prev + 1)}
          >
            <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <Textarea
          value={script[currentEpisode]?.script || ""}
          onChange={(e) =>
            handleScriptChange(
              script[currentEpisode]?.episode || 1,
              e.target.value
            )
          }
          placeholder="Edit your script here..."
          className={`flex-1 shadow-lg overflow-y-auto bg-neutral-800 border-t border-neutral-600 backdrop-blur-sm text-white p-4 rounded-t-2xl ${generatingChanges && "blur-sm"}`}
          style={{ resize: "none" }}
        />
        <div className="flex items-center justify-end space-x-2">
          <div className="flex justify-end px-6 bg-transparent">
            {isPublished && <UpdatePodcastDialog />}
            {!isPublished && hasAllAudioUrls && <PublishPodcastDialog />}
            {!isPublished && !hasAllAudioUrls && (
              <GeneratePodcastDialog
                podcastId={podcastDetails._id}
                updating={updating}
                generatingChanges={generatingChanges}
              />
            )}
          </div>
        </div>

        {generatingChanges && (
          <div className="animate-pulse absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-md transition-all">
            <div className="text-white text-sm font-medium">
              <LuLoaderCircle className="inline-block mr-2 size-4 animate-spin" />
              Generating changes...
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReviewScript;
