import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";
import { ShineBorder } from "@/components/magicui/shine-border";

import ImportFromGithub from "@/components/ImportFromGithub";
import { NextResponse } from "next/server";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

const Create = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.redirect(
      new URL("/", process.env.NEXTAUTH_URL || "http://localhost:3000")
    );
  }

  return (
    <div className="h-screen flex flex-col relative items-center px-4">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
      />
      <h1 className="mt-16 text-center text-balance md:mt-24 py-2 text-2xl md:text-4xl font-medium mb-12 text-white">
        What do you want to create today?
      </h1>
      <div className="p-2 md:p-4 max-w-2xl w-full rounded-md relative border border-neutral-600 bg-neutral-900">
        <ShineBorder shineColor={["#e60076", "#7c86ff", "#fb64b6"]} />
        <Textarea
          placeholder="Describe your idea here..."
          className="h-52 overflow-y-auto w-full focus:outline-none focus:ring-0 focus:border-transparent text-sm md:text-lg placeholder:text-sm md:placeholder:text-lg placeholder:text-neutral-500"
          style={{ resize: "none" }}
        />
        <div className="flex items-center justify-end mt-4 gap-4">
          <ImportFromGithub accessToken={session?.accessToken} />
          <Button className="cursor-pointer bg-neutral-800 border border-transparent hover:border-pink-300 text-white text-xs transition-all duration-200 ease-in-out">
            Create
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
