"use client";

import { CgMediaPodcast } from "react-icons/cg";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
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
import { useCallback, useState } from "react";
import axios from "axios";
import { Podcast } from "@/models/Podcast";

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
  const saveAudioMutation = useMutation(api.podcasts.mutations.saveAudioUrl);

  const fetchEpisodes = async () => {
    setGenerationState("gettingReady");
    const data = (await getPodcastById({
      podcastId: podcastId as Id<"podcasts">,
    })) as Podcast | null;

    if (!data || !data.episodes) {
      throw new Error("Podcast or episodes not found");
    }
    const { episodes } = data;

    console.log("Fetched episodes:", episodes);
    setAudioProcessed({
      total: episodes.length,
      current: 1,
      completed: 0,
      failed: 0,
    });
    return episodes;
  };

  const saveAudio = useCallback(
    async (audioUrl: string, episode: number) => {
      console.log("Saving audio for episode:", episode, "URL:", audioUrl);
      const res = await saveAudioMutation({
        podcastId: podcastId as Id<"podcasts">,
        episode,
        audioUrl,
      });
      return res;
    },
    [saveAudioMutation, podcastId]
  );

  const generateAudio = async (episodes: Episode[]) => {
    console.log("Generating audio for episodes:", episodes);
    setGenerationState("generating");
    for (const episode of episodes) {
      try {
        const res = await axios.post("/api/generateAudio", {
          podcastId,
          episode,
        });

        if (res.status === 200) {
          const isSaved = await saveAudio(res.data.audioUrl, episode.episode);
          if (isSaved.success) {
            setAudioProcessed((prev) => ({
              ...prev,
              completed: prev.completed + 1,
              current: prev.current + 1,
            }));
          }
        }
      } catch {
        setAudioProcessed((prev) => ({
          ...prev,
          failed: prev.failed + 1,
          current: prev.current + 1,
        }));
      }
    }
  };

  const startAudioGeneration = async () => {
    try {
      const episodes = await fetchEpisodes();
      await generateAudio(episodes);

      //setGenerationState("completed");
    } catch {
      setGenerationState("error");
    }
  };

  return (
    <div className="flex justify-end px-6 bg-transparent">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={generatingChanges || updating}
            className="mb-4 py-6 cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out mt-4"
          >
            <CgMediaPodcast className="mr-2 size-5" />
            Generate Podcast
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="py-4 px-1 sm:p-6 bg-neutral-900/80 backdrop-blur-sm text-white border border-neutral-800 max-w-2xl w-full">
          {generationState === "idle" ? (
            <IdleState startAudioGeneration={startAudioGeneration} />
          ) : generationState === "gettingReady" ? (
            <GettingReadyState />
          ) : generationState === "generating" ? (
            <GeneratingState {...audioProcessed} />
          ) : (
            <CompletedState />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
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
      <AlertDialogFooter>
        <AlertDialogCancel className="cursor-pointer bg-neutral-900 hover:bg-neutral-950/80 hover:text-white border border-neutral-600">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={startAudioGeneration}
          className="group cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out"
        >
          Continue
          <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

const GettingReadyState = () => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Gettings thing ready</AlertDialogTitle>
        <AlertDialogDescription className="text-neutral-400">
          We are preparing to generate your podcast.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex items-center">
        <LoaderCircle className="mx-auto my-4 size-8 animate-spin text-pink-300" />
        <p className="text-white text-sm">Loading...</p>
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
          Generating your podcast. This may take a few moments, please do not
          close the browser.
        </AlertDialogDescription>
        <div>
          <div className="mt-4">
            <p className="text-sm text-white">
              Total Episodes: {audioProcessed.total}
            </p>
            <p className="text-sm text-white">
              Current Episode: {audioProcessed.current}
            </p>
            <p className="text-sm text-white">
              Completed: {audioProcessed.completed}
            </p>
            <p className="text-sm text-red-400">
              Failed: {audioProcessed.failed}
            </p>
          </div>
          <LoaderCircle className="mx-auto my-4 size-8 animate-spin text-pink-300" />
          <p className="text-white text-sm">Generating...</p>
        </div>
      </AlertDialogHeader>
    </>
  );
};

const CompletedState = () => {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Generation complete</AlertDialogTitle>
        <AlertDialogDescription className="text-neutral-400">
          Your podcast has been successfully generated and is ready for
          publishing.
        </AlertDialogDescription>
      </AlertDialogHeader>
    </>
  );
};

export default GeneratePodcastDialog;
