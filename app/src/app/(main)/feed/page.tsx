import FeedSearch from "@/components/FeedSearch";
import PodcastList from "@/components/PodcastList";

import React from "react";

const HeroSection = () => {
  return (
    <section className="relative mt-6">
      <div>
        <h1 className="text-6xl text-center text-balance font-bold text-white">
          Explore podcasts from devs
        </h1>
        <p className="mt-6 text-center text-xl text-gray-300">
          Developer wisdom in your ears — wherever your day takes you.
        </p>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2 right-1/3 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

const Feed = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <FeedSearch />
      <HeroSection />
      <PodcastList />
    </div>
  );
};

export default Feed;
