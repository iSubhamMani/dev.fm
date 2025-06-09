"use client";

import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RxExternalLink } from "react-icons/rx";
import { FaLock } from "react-icons/fa6";
import { BiGlobe } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getRepos = async (accessToken: string) => {
  const response = await axios.get(
    "https://api.github.com/user/repos?sort=updated&direction=desc&affiliation=owner",
    {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    }
  );

  return response.data;
};

interface ImportFromGithubProps {
  accessToken: string;
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
}

const ImportFromGithub = ({ accessToken }: ImportFromGithubProps) => {
  const query = useQuery({
    queryKey: ["repos"],
    queryFn: () => getRepos(accessToken),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-neutral-800 hover:bg-neutral-900 text-white text-xs">
          Import from GitHub
          <FaGithub className="ml-1 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="py-4 px-1 sm:p-6 bg-neutral-950 text-white border border-neutral-800 max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>
            <span className="inline-flex items-center">
              <FaGithub className="mr-2 size-5" />
            </span>
            Choose from your repos
          </DialogTitle>
          <DialogDescription>
            Select a repository to import your project from GitHub. Ensure you
            have a README.md file in the root directory for this to work.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-2 h-[360px]">
          {query.data &&
            query.data.length > 0 &&
            query.data.map((repo: Repo) => (
              <RepoItem key={repo.id} repo={repo} />
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const RepoItem = ({ repo }: { repo: Repo }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-neutral-950 px-4 py-3 border-b  border-neutral-800">
      <div className="flex items-center gap-2 flex-1 ">
        {repo.private ? (
          <FaLock className="text-red-500 size-4 mr-1" />
        ) : (
          <BiGlobe className="text-green-500 size-4 mr-1" />
        )}
        <Link target="_blank" href={repo.html_url}>
          <div className="space-y-1">
            <div className="flex items-center">
              <p className="text-sm font-bold text-white">{repo.name}</p>
              <span className="ml-1 size-4 text-neutral-300">
                <RxExternalLink />
              </span>
            </div>
            <p className="text-xs text-neutral-300">{repo.full_name}</p>
          </div>
        </Link>
      </div>
      <div className="mr-2 self-end sm:self-center">
        <p className="bg-white font-medium rounded-md cursor-pointer text-black hover:bg-white/90 p-2 text-xs shadow-md shadow-pink-600">
          Import
        </p>
      </div>
    </div>
  );
};

export default ImportFromGithub;
