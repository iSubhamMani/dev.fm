import { authOptions } from "@/app/api/auth/[...nextauth]/config";

import { getServerSession } from "next-auth";
import React from "react";

import { NextResponse } from "next/server";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import IdeaInput from "@/components/IdeaInput";
import PodcastThreadList from "@/components/PodcastThreadList";

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
      <PodcastThreadList userId={session.userId} />
      <h1 className="mt-16 text-center text-balance md:mt-24 py-2 text-2xl md:text-4xl font-medium mb-12 text-white">
        What do you want to create today?
      </h1>
      <IdeaInput session={session} />
    </div>
  );
};

export default Create;
