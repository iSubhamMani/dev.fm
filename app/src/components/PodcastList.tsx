"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Clock, Play, Rocket, User } from "lucide-react";
import { useMemo } from "react";

interface PodcastData {
  title?: string;
  description?: string;
  coverImage?: string;
  userId: string;
  episodes?: {
    episode: number;
    title: string;
    script: string;
    audioUrl?: string;
  }[];
  _id: string;
  updatedAt?: string;
}

const PodcastList = () => {
  const data = useQuery(api.podcasts.queries.geLatestPublishedPodcasts);
  const podcastData = useMemo(() => {
    return (
      data &&
      data.map((podcast) => {
        return {
          title: podcast.title,
          description: podcast.description,
          coverImage:
            podcast.coverImage ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWlWGKAgUlRn6ZSrKrYT2GxSfWKjYaSfu4tw&s",
          userId: podcast.userId,
          episodes: podcast.episodes,
          _id: podcast._id,
          updatedAt: podcast.updatedAt,
        };
      })
    );
  }, [data]);

  const isLoading = data === undefined;
  const error = data === null;

  return (
    <div className="mt-12">
      <p className="text-sm flex items-center gap-2 font-medium text-center border border-teal-400 text-white px-6 py-2 bg-pink-400/10 backdrop-blur-md rounded-full w-max mx-auto">
        <Rocket className="size-4 text-teal-300" /> Latest
      </p>
      <div className="flex justify-center space-x-6 my-6">
        {isLoading && <Loading className="w-1/2 h-96" />}
        {!isLoading && !error && podcastData && podcastData.length > 0 && (
          <LatestCard podcast={podcastData[0]} />
        )}
        <div className="w-1/3 space-y-4">
          {isLoading && (
            <>
              <Loading className="w-full h-64" />
              <Loading className="w-full h-64" />
            </>
          )}
          {!isLoading && !error && podcastData && (
            <>
              <LatestCardColumn podcast={podcastData[0]} />
              <LatestCardColumn podcast={podcastData[0]} />
              <LatestCardColumn podcast={podcastData[0]} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Loading = ({ className }: { className: string }) => {
  return (
    <Skeleton
      className={`${className} rounded-md bg-neutral-800/55 border border-pink-300/10`}
    />
  );
};

const LatestCard = ({ podcast }: { podcast: PodcastData }) => {
  return (
    <Card className="p-0 rounded-md w-1/2 h-64 shadow-xl border border-neutral-700 overflow-hidden cursor-pointer">
      <CardContent className="p-0 h-full">
        <div className="relative h-full w-full overflow-hidden group bg-neutral-800">
          <Image
            src={
              podcast.coverImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWlWGKAgUlRn6ZSrKrYT2GxSfWKjYaSfu4tw&s"
            }
            className="h-full w-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out brightness-75 group-hover:brightness-50"
            width={600}
            height={300}
            alt={podcast.title!}
          />

          <div className="absolute bottom-0 pb-4 pt-6 bg-gradient-to-t from-black/90 to-transparent w-full">
            <div className="flex items-center">
              <Play className="size-5 text-pink-400 opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-300 ease-in-out" />
              <div className="flex-1 flex justify-between items-end pr-4">
                <p
                  className="transition-transform text-xl font-medium text-white
                    group-hover:translate-x-6"
                >
                  {podcast.title}
                </p>
                <p className="text-neutral-200 text-sm flex items-center">
                  <User className="inline mr-1 size-4" />
                  {podcast.userId}
                </p>
              </div>
            </div>
            <p className="text-pink-200 text-sm items-center pl-4 flex">
              <Clock className="size-4 mr-1" />
              {podcast.episodes?.length} episodes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LatestCardColumn = ({ podcast }: { podcast: PodcastData }) => {
  return (
    <Card className="hover:scale-95  transition-transform duration-300 ease-in-out p-0 relative rounded-md w-full h-28 shadow-xl border border-neutral-700 overflow-hidden cursor-pointer">
      {/* Background Image */}
      <div className="absolute inset-0 bg-neutral-800">
        <Image
          className="w-full h-full object-cover"
          src={
            podcast.coverImage ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWlWGKAgUlRn6ZSrKrYT2GxSfWKjYaSfu4tw&s"
          }
          alt="Podcast Cover"
          fill
        />
        {/* Gradient Overlay from Left to Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/80" />
      </div>

      {/* Text Content */}
      <CardContent className="pb-4 relative z-10 flex flex-col justify-end h-full text-white">
        <h3 className="text-base font-semibold truncate">{podcast.title}</h3>
        <div className="mt-1 text-xs text-neutral-200">
          {podcast.episodes?.length} episodes • {podcast.userId}
        </div>
      </CardContent>
    </Card>
  );
};

export default PodcastList;
