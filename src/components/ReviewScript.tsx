"use client";

import { CgMediaPodcast } from "react-icons/cg";
import { RiSendPlaneLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Podcast } from "@/models/Podcast";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LuLoaderCircle } from "react-icons/lu";
import { RiRobot2Fill } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WordRotate } from "./magicui/word-rotate";
import { Id } from "../../convex/_generated/dataModel";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
  const [script, setScript] = useState(podcastDetails.script || "");
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [generatingChanges, setGeneratingChanges] = useState(false);
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
      setScript(toolResults?.script);
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

  return (
    <div
      className={`h-screen bg-[radial-gradient(ellipse_90%_90%_at_50%_-30%,rgba(236,72,153,0.25),rgba(96,130,246,0.25),rgba(255,255,255,0))] flex bg-neutral-950/95 relative overflow-hidden text-white`}
    >
      <section className="w-full border-l-2 border-neutral-800 flex flex-col">
        <div className="flex-1 flex flex-col overflow-y-auto rounded-sm border border-neutral-600 shadow-lg bg-neutral-900/60 backdrop-blur-sm text-white p-4">
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto px-4 pb-6 pt-2">
            {chatMessages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={` flex items-start gap-2 w-full max-w-md ${message.role === "user" ? "text-pink-300 self-end flex-row-reverse" : "text-blue-300 self-start"}`}
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
      <section className="relative w-full overflow-hidden p-6 flex flex-col">
        <h1 className="text-sm text-center font-bold text-white bg-neutral-900/60 px-4 py-3 rounded-md shadow-lg mb-2">
          Script
        </h1>
        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Edit your script here..."
          className={`flex-1 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm rounded-md border border-neutral-600 shadow-lg text-white p-4 ${generatingChanges && "blur-sm"}`}
          style={{ resize: "none" }}
        />
        <Button
          disabled={generatingChanges}
          className="py-6 cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out mt-4"
        >
          <CgMediaPodcast className="mr-2 size-5" />
          Generate Podcast
        </Button>

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
