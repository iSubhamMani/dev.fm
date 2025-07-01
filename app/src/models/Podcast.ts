enum PodcastStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export interface Podcast {
  _id: string;
  title?: string;
  idea: string;
  threadId?: string;
  userId: string;
  status: PodcastStatus;
  episodes?: {
    episode: number;
    title: string;
    script: string;
    audio?: {
      url: string;
      duration: number;
    };
  }[];
  scriptGenerated?: boolean;
  updatedAt?: string;
  coverImage?: string;
  description?: string;
}

export type PodcastData = Pick<
  Podcast,
  | "_id"
  | "title"
  | "description"
  | "coverImage"
  | "userId"
  | "episodes"
  | "updatedAt"
>;
