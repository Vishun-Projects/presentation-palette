import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";

export const saveFile = async (buffer: Buffer, fileName: string, subDir: string) => {
  const ext = fileName.split(".").pop();
  const id = uuidv4();
  const savedName = `${id}.${ext}`;

  // If we are on Vercel and have a token, use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(`uploads/${subDir}/${savedName}`, buffer, {
      access: 'public',
    });
    return url;
  }

  // If we are on Vercel but token is missing, fail with a clear message
  if (process.env.VERCEL) {
    throw new Error("Vercel Blob storage is not connected. Please go to your Vercel Dashboard, click the 'Storage' tab, and connect 'Blob' to enable production uploads.");
  }

  // Fallback to local storage for local development
  const uploadDir = join(process.cwd(), "public", "uploads", subDir);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    // Ignore if directory already exists
  }
  
  const filePath = join(uploadDir, savedName);
  await writeFile(filePath, buffer);
  
  return `/uploads/${subDir}/${savedName}`;
};
