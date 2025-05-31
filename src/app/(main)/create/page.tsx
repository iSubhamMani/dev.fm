import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import React from "react";

const Create = () => {
  return (
    <div className="h-screen flex flex-col items-center px-4">
      <h1 className="mt-16 text-center text-balance md:mt-24 py-2 text-2xl md:text-4xl font-medium mb-12 bg-gradient-to-b from-white to-pink-300 bg-clip-text text-transparent">
        What do you want to create today?
      </h1>
      <div className="p-2 md:p-4 max-w-2xl w-full rounded-md border border-white/10 shadow-xl ">
        <Textarea
          placeholder="Describe your idea here..."
          className="h-52 overflow-y-auto w-full focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-lg placeholder:text-sm md:placeholder:text-lg placeholder:text-neutral-500"
          style={{ resize: "none" }}
        />
        <div className="flex items-center justify-end mt-4">
          <Button className="cursor-pointer bg-neutral-900 text-pink-300 text-xs sm:text-sm">
            Create
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
