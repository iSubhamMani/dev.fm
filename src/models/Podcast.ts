enum PodcastStatus {
  DRAFT = "draft",
  SCRIPT_GENERATED = "scriptGenerated",
  AUDIO_GENERATED = "audioGenerated",
  PUBLISHED = "published",
}

export interface Podcast {
  _id: string;
  title?: string;
  idea: string;
  threadId?: string;
  userId: string;
  status: PodcastStatus;
  script?: string;
  audioUrl?: string;
}
