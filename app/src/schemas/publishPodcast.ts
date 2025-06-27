import { z } from "zod";
const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const publishPodcastSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  episodeTitles: z.array(
    z.object({
      episode: z
        .number()
        .int()
        .positive("Episode number must be a positive integer"),
      title: z.string().min(1, "Episode title is required"),
    })
  ),
  coverImage:
    typeof window === "undefined"
      ? z.any()
      : z
          .instanceof(FileList, {
            message: "Cover image is required",
          })
          .refine(
            (files) => {
              const file = files?.item(0);
              if (!file) return true;

              return file?.size <= MAX_FILE_SIZE;
            },
            {
              message: `Image size should be less than ${MAX_FILE_SIZE / 1000000}MB.`,
            }
          )
          .refine(
            (files) => {
              const file = files?.item(0);
              if (!file) return true;

              return ACCEPTED_IMAGE_TYPES.includes(file?.type);
            },
            { message: "Only JPEG, JPG, and PNG images are allowed." }
          ),
});
