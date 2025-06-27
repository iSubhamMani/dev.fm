import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const coverImage = formData.get("coverImage") as File | null;

    if (!coverImage) throw new Error("No cover image provided");
    const fileBuffer = await coverImage.arrayBuffer();

    const mimeType = coverImage.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // this will be used to upload the file
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadImageToCloudinary(fileUri, "podcasts/cover-images");

    if (!res) throw new Error("Failed to upload image");

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        url: res.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
