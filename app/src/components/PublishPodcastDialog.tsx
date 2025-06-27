/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "./ui/button";
import { Radio } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { publishPodcastSchema } from "@/schemas/publishPodcast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import axios from "axios";
import { toast } from "sonner";
import { error, success } from "@/utils/sonnerStyles";
import { useState } from "react";

const PublishPodcastDialog = ({ podcastId }: { podcastId: string }) => {
  const data = useQuery(api.podcasts.queries.getPodcastById, {
    podcastId: podcastId as Id<"podcasts">,
  });

  const publishPodcast = useMutation(api.podcasts.mutations.publishPodcast);

  const publishPodcastForm = useForm<z.infer<typeof publishPodcastSchema>>({
    resolver: zodResolver(publishPodcastSchema),
    defaultValues: {
      title: "",
      description: "",
      episodeTitles:
        data?.episodes?.map((episode) => ({
          episode: episode.episode,
          title: episode.title,
        })) || [],
      coverImage: undefined as FileList | undefined,
    },
  });

  const [isPublishing, setIsPublishing] = useState(false);

  const onSubmit = async (data: z.infer<typeof publishPodcastSchema>) => {
    try {
      setIsPublishing(true);
      const fd = new FormData();
      fd.append("coverImage", data.coverImage[0]);

      const res = await axios.post("/api/upload", fd);

      if (res.data && res.data.url) {
        const coverImageUrl = res.data.url;
        const podcastData = {
          title: data.title,
          description: data.description,
          coverImage: coverImageUrl,
          episodeTitles: data.episodeTitles.map((episode) => ({
            episode: episode.episode,
            title: episode.title,
          })),
        };

        const isPublished = await publishPodcast({
          podcastId: podcastId as Id<"podcasts">,
          ...podcastData,
          status: "published",
        });

        if (isPublished) {
          toast.success("Podcast published successfully!", {
            style: success,
            duration: 3000,
            position: "top-center",
          });
        }
      }
    } catch {
      toast.error("Error publishing podcast", {
        style: error,
        duration: 3000,
        position: "top-center",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4 py-6 cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out mt-4">
          <Radio className="mr-1 size-5" />
          Continue to Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="py-4 px-1 sm:p-6 bg-neutral-900/80 backdrop-blur-sm text-white border border-neutral-800 max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Publish</DialogTitle>
          <DialogDescription>
            Edit your podcast details before publishing.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-6">
          <Form {...publishPodcastForm}>
            <form
              onSubmit={publishPodcastForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={publishPodcastForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-neutral-300">Title</FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="bg-neutral-900/80 text-white placeholder:text-neutral-500"
                        {...field}
                        type="text"
                        placeholder="Podcast Title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={publishPodcastForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-neutral-300">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        required
                        className="border bg-neutral-900/80 text-white placeholder:text-neutral-500 h-40"
                        {...field}
                        placeholder="A brief description of your podcast"
                        style={{
                          resize: "none",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.episodes?.length ? (
                data.episodes.map((episode) => (
                  <FormField
                    key={episode.episode}
                    control={publishPodcastForm.control}
                    name={`episodeTitles.${episode.episode - 1}.title`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-neutral-300">
                          Episode {episode.episode} Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            {...field}
                            type="text"
                            placeholder={`Episode ${episode.episode} Title`}
                            className="bg-neutral-900/80 text-white placeholder:text-neutral-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  No episodes available to edit titles.
                </p>
              )}
              <FormField
                control={publishPodcastForm.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel
                      htmlFor="coverImageInput"
                      className="text-neutral-300"
                    >
                      Cover Image
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={(e) => field.onChange(e.target.files)}
                          className="hidden"
                          id="coverImageInput"
                        />
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            const input = document.getElementById(
                              "coverImageInput"
                            ) as HTMLInputElement;
                            input.click();
                          }}
                          type="button"
                          variant="secondary"
                          className="cursor-pointer font-medium bg-neutral-800 border border-transparent hover:bg-neutral-900 hover:border-pink-300 text-neutral-300 text-xs transition-all duration-200 ease-in-out"
                        >
                          Choose File
                        </Button>
                      </div>
                    </FormControl>
                    {field.value && field.value.length > 0 && (
                      <p className="text-sm text-neutral-400">
                        {field.value[0].name.length > 40
                          ? `${field.value[0].name.slice(0, 40)}...`
                          : field.value[0].name}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  disabled={isPublishing}
                  type="submit"
                  className="cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out"
                >
                  {isPublishing ? "Hang Tight..." : "Publish"}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PublishPodcastDialog;
