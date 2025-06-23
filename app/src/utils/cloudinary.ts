import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAudioToCloudinary = async (audioBuffer: Buffer) => {
  const mimeType = "audio/wav";
  const encoding = "base64";
  const base64Data = Buffer.from(audioBuffer).toString("base64");

  // this will be used to upload the file
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
  const res = await cloudinary.uploader.upload(fileUri, {
    invalidate: true,
    resource_type: "raw",
    folder: "devfm/podcasts",
    format: "mp3",
    public_id: `podcast-audio-${Date.now()}.mp3`,
  });

  return res.secure_url;
};
