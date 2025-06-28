import PodcastList from "@/components/PodcastList";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
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
      <section className="w-full max-w-3xl mx-auto p-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search podcasts..."
            className="shadow-md py-6 pl-10 pr-12 bg-gray-900/50 border-gray-600 text-white placeholder-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
      </section>
      <HeroSection />
      <PodcastList />
    </div>
  );
};

export default Feed;
