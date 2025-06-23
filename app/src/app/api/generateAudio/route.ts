import { NextRequest, NextResponse } from "next/server";
import { uploadAudioToCloudinary } from "@/utils/cloudinary";
import wav from "wav";

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

export async function POST(req: NextRequest) {
  try {
    const { podcastId, episode }: { podcastId: string; episode: Episode } =
      await req.json();

    if (
      !podcastId ||
      !episode ||
      typeof episode.episode !== "number" ||
      !episode.title ||
      !episode.script
    ) {
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { message: "Failed to generate audio data" },
        { status: 500 }
      );
    }
    const audioBuffer = Buffer.from(data, "base64");
    console.log("Audio generated:", audioBuffer);

    const fileName = "out.wav";
    //await saveWaveFile(fileName, audioBuffer);

    //const audioUrl = await uploadAudioToCloudinary(audioBuffer);
    const blob = await put(`speech-output-${Date.now()}.wav`, audioBuffer, {
      access: "public", // or 'private'
      contentType: "audio/wav",
    });

    console.log("Audio uploaded to Vercel Blob:", blob.url);
    const audioUrl = blob.url;
    if (!audioUrl) {
      return NextResponse.json(
        { message: "Failed to upload audio to Cloudinary" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Audio generated and uploaded successfully", audioUrl },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
