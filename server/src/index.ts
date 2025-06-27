import express, { Request, Response } from "express";
import wav from "wav";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

interface Episode {
  episode: number;
  title: string;
  script: string;
}

async function saveWaveFile(
  filename: string,
  pcmData: Buffer<ArrayBuffer>,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
) {
  return new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(filename, {
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    writer.on("finish", resolve);
    writer.on("error", reject);

    writer.write(pcmData);
    writer.end();
  });
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Everything looks good!" });
});

app.post("/api/generateAudio", async (req: Request, res: Response) => {
  try {
    const { episode }: { episode: Episode } = req.body;

    if (
      !episode ||
      typeof episode.episode !== "number" ||
      !episode.title ||
      !episode.script
    ) {
      res.status(400).json({ message: "Invalid input data" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts", // Or other suitable TTS model
      contents: [{ parts: [{ text: episode.script }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const data =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!data || typeof data !== "string") {
      res.status(400).json({ message: "Invalid audio data" });
      return;
    }

    const audioBuffer = Buffer.from(data, "base64");
    const filename = `out-${Date.now()}.wav`;
    const filePath = path.join(__dirname, "../uploads", filename);

    // Ensure 'uploads/' directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Write file to disk
    await saveWaveFile(filePath, audioBuffer);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "devfm/podcasts/audio",
    });

    // Delete file after upload
    fs.unlinkSync(filePath);

    res.status(200).json({ audioUrl: uploadResult.secure_url });
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}...`);
});
