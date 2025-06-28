"use client";

import { Input } from "@/components/ui/input";
import { useAction } from "convex/react";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { api } from "../../convex/_generated/api";
import { PodcastData } from "@/models/Podcast";
import { toast } from "sonner";
import { error } from "@/utils/sonnerStyles";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";

const FeedSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const searchByQuery = useAction(api.podcasts.actions.getSearchResults);
  const [results, setResults] = useState<PodcastData[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchSearchResults = useCallback(async () => {
    if (searchByQuery && debouncedQuery.trim()) {
      try {
        setIsSearching(true);
        const response = await searchByQuery({ query: debouncedQuery });
        setResults(response as PodcastData[]);
      } catch {
        toast.error("Failed to fetch search results. Please try again.", {
          style: error,
          duration: 3000,
          position: "top-center",
        });
      } finally {
        setIsSearching(false);
      }
    }
  }, [debouncedQuery, searchByQuery]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  return (
    <section className="w-full max-w-3xl mx-auto px-6 pt-6 relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search podcasts..."
          className="shadow-md py-6 pl-10 pr-12 bg-gray-900/50 border-gray-600 text-white placeholder-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
        />
      </div>
      {searchQuery && (
        <div className="absolute w-full bg-gray-900/80 backdrop-blur-xl rounded-md p-4 top-full mt-1 left-0 z-10">
          {results.length > 0 && !isSearching ? (
            results.map((podcast) => (
              <SearchItem key={podcast._id} podcast={podcast} />
            ))
          ) : isSearching ? (
            <p className="text-gray-400 text-center text-sm">Searching...</p>
          ) : (
            <p className="text-gray-400 text-center text-sm">
              No results found
            </p>
          )}
        </div>
      )}
    </section>
  );
};

const SearchItem = ({ podcast }: { podcast: PodcastData }) => {
  return (
    <Card className="cursor-pointer border-none bg-transparent hover:bg-gray-800/50 rounded-md transition-colors">
      <CardContent className="flex items-center gap-4">
        <Image
          src={podcast.coverImage || "https://via.placeholder.com/50"}
          alt={podcast.title!}
          className="w-12 h-12 rounded-md"
          width={50}
          height={50}
        />
        <div>
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {podcast.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-1">
            {podcast.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedSearch;
