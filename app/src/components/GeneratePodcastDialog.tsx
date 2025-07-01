"use client";

import { CgMediaPodcast } from "react-icons/cg";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Podcast } from "@/models/Podcast";
import { toast } from "sonner";
import { error, info } from "@/utils/sonnerStyles";

interface Episode {
  episode: number;
  title: string;
  script: string;
}

type AudioProcessed = {
  total: number;
  current: number;
  completed: number;
  failed: number;
};

const GeneratePodcastDialog = ({
  generatingChanges,
  updating,
  podcastId,
}: {
  generatingChanges: boolean;
  updating: boolean;
  podcastId: string;
}) => {
  const [audioProcessed, setAudioProcessed] = useState<AudioProcessed>({
    total: 0,
    current: 0,
    completed: 0,
    failed: 0,
  });
  const [generationState, setGenerationState] = useState<
    "idle" | "gettingReady" | "generating" | "completed" | "error"
  >("idle");
  const getPodcastById = useAction(api.podcasts.actions.fetchPodcast);
  const saveAudioMutation = useMutation(api.podcasts.mutations.saveAudio);

  const fetchEpisodes = async () => {
    setGenerationState("gettingReady");
    const data = (await getPodcastById({
      podcastId: podcastId as Id<"podcasts">,
    })) as Podcast | null;

    if (!data || !data.episodes) {
      throw new Error("Podcast or episodes not found");
    }
    const { episodes } = data;
    const filteredEpisodes = episodes.filter((e) => !e.audio?.url); // skip episodes that already have audio

    setAudioProcessed({
      total: filteredEpisodes.length,
      current: 1,
      completed: 0,
      failed: 0,
    });
    return filteredEpisodes;
  };

  const saveAudio = useCallback(
    async (audioUrl: string, duration: number, episode: number) => {
      const res = await saveAudioMutation({
        podcastId: podcastId as Id<"podcasts">,
        episode,
        audio: {
          url: audioUrl,
          duration,
        },
      });
      return res;
    },
    [saveAudioMutation, podcastId]
  );

  const generateAudio = async (episodes: Episode[]) => {
    setGenerationState("generating");
    for (const episode of episodes) {
      try {
        const res = await axios.post(
          "https://dev-fm.onrender.com/api/generateAudio",
          {
            podcastId,
            episode,
          }
        );

        if (res.status === 200) {
          const isSaved = await saveAudio(
            res.data.audioData.url,
            res.data.audioData.duration,
            episode.episode
          );
          if (isSaved.success) {
            setAudioProcessed((prev) => ({
              ...prev,
              completed: prev.completed + 1,
              current:
                prev.current < prev.total ? prev.current + 1 : prev.total,
            }));
          }
        }
      } catch {
        setAudioProcessed((prev) => ({
          ...prev,
          failed: prev.failed + 1,
          current: prev.current < prev.total ? prev.current + 1 : prev.total,
        }));
      }
    }
  };

  const startAudioGeneration = async () => {
    try {
      const episodes = await fetchEpisodes();
      await generateAudio(episodes);
      setGenerationState("completed");
    } catch {
      setGenerationState("error");
    }
  };

  useEffect(() => {
    if (generationState === "error") {
      toast.error("An error occurred while generating the podcast episodes.", {
        style: error,
        duration: 3000,
        position: "top-center",
      });
      setGenerationState("idle");
      setAudioProcessed({
        total: 0,
        current: 0,
        completed: 0,
        failed: 0,
      });
    } else if (generationState === "completed" && audioProcessed.failed > 0) {
      toast.info(
        `Failed to generate ${audioProcessed.failed} podcast episodes. Please try again.`,
        {
          style: info,
          duration: 3000,
          position: "top-center",
        }
      );
      setGenerationState("idle");
      setAudioProcessed({
        total: 0,
        current: 0,
        completed: 0,
        failed: 0,
      });
    }
  }, [generationState, audioProcessed]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={generatingChanges || updating}
          className="mb-4 py-6 cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out mt-4"
        >
          <CgMediaPodcast className="mr-1 size-5" />
          Generate Podcast
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="py-4 px-1 sm:p-6 bg-neutral-900/80 backdrop-blur-sm text-white border border-neutral-800 max-w-2xl w-full">
        {generationState === "idle" ? (
          <IdleState startAudioGeneration={startAudioGeneration} />
        ) : generationState === "gettingReady" ? (
          <GettingReadyState />
        ) : (
          <GeneratingState {...audioProcessed} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

const IdleState = ({
  startAudioGeneration,
}: {
  startAudioGeneration: () => void;
}) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription className="text-neutral-400">
          This action will generate a podcast based on the script. Make sure you
          have reviewed all details before proceeding. Once you continue, please
          do not close the browser.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div>
        <AlertDialogFooter className="flex items-center justify-end gap-2">
          <AlertDialogCancel className="cursor-pointer bg-neutral-900 hover:bg-neutral-950/80 hover:text-white border border-neutral-600">
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={startAudioGeneration}
            className="group cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out"
          >
            Continue
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AlertDialogFooter>
      </div>
    </>
  );
};

const GettingReadyState = () => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Gettings thing ready</AlertDialogTitle>
        <AlertDialogDescription className="text-neutral-400">
          Preparing to generate your podcast.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex items-center gap-2">
        <LoaderCircle className="my-4 size-8 animate-spin text-pink-300" />
        <span className="text-white text-sm">Loading...</span>
      </div>
    </>
  );
};

const GeneratingState = (audioProcessed: AudioProcessed) => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Generating your podcast</AlertDialogTitle>
        <AlertDialogDescription className="text-neutral-400">
          This may take a few minutes, please do not close the browser.
        </AlertDialogDescription>
        <div>
          <div className="flex items-center gap-2">
            <LoaderCircle className="my-4 size-8 animate-spin text-pink-300" />
            <span className="text-white text-sm">
              Generating ({audioProcessed.current}/{audioProcessed.total}){" "}
            </span>
          </div>
          {audioProcessed.failed !== 0 && (
            <p className="text-red-500 text-sm">
              Failed to generate {audioProcessed.failed}{" "}
              {audioProcessed.failed > 1 ? "audios" : "audio"}
            </p>
          )}
        </div>
      </AlertDialogHeader>
    </>
  );
};

export default GeneratePodcastDialog;
