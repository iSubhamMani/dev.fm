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
    audioUrl?: string;
  }[];
  scriptGenerated?: boolean;
  updatedAt?: string;
}
