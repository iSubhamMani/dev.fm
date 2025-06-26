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
import { Controller, useForm } from "react-hook-form";
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
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Label } from "./ui/label";

const PublishPodcastDialog = ({ podcastId }: { podcastId: string }) => {
  const data = useQuery(api.podcasts.queries.getPodcastById, {
    podcastId: podcastId as Id<"podcasts">,
  });
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
      coverImage: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof publishPodcastSchema>) => {
    try {
      publishPodcastForm.reset();
    } catch (error) {
      console.error("Error publishing podcast:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4 py-6 cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out mt-4">
          <Radio className="mr-1 size-5" />
          Publish
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
              <Controller
                control={publishPodcastForm.control}
                name="coverImage"
                render={({ field: { onChange, value, ref } }) => (
                  <div className="space-y-2">
                    <div className="space-y-2">
                      {/* Hidden input */}
                      <Label
                        className="text-neutral-300"
                        htmlFor="customFileInput"
                      >
                        Cover Image
                      </Label>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        ref={ref}
                        className="hidden"
                        id="customFileInput"
                      />

                      {/* Custom Button */}
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          const input = document.getElementById(
                            "customFileInput"
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

                    {/* Show selected file name (optional) */}
                    {value && (
                      <p className="text-sm text-neutral-400 line-clamp-1">
                        {value.name.length > 50
                          ? `${value.name.slice(0, 50)}...`
                          : value.name}
                      </p>
                    )}
                  </div>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="cursor-pointer font-medium bg-neutral-800 border border-transparent hover:border-pink-300 text-pink-300 text-sm transition-all duration-200 ease-in-out"
                >
                  Publish
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
