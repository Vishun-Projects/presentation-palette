import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export const saveFile = async (buffer: Buffer, fileName: string, subDir: string) => {
  const uploadDir = join(process.cwd(), "public", "uploads", subDir);
  await mkdir(uploadDir, { recursive: true });
  
  const ext = fileName.split(".").pop();
  const id = uuidv4();
  const savedName = `${id}.${ext}`;
  const filePath = join(uploadDir, savedName);
  
  await writeFile(filePath, buffer);
  
  return `/uploads/${subDir}/${savedName}`;
};
