"use server";

import { addFeedback, addPin, addTestimonial, deleteFeedback, deletePin, deleteTestimonial, getFeedback, getPins, getTestimonials, updatePin, updateTestimonial } from "@/src/lib/db";
import { saveFile } from "@/src/lib/files";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function getPinsFn() {
  return getPins();
}

export async function getTestimonialsFn() {
  return getTestimonials();
}

export async function getFeedbackFn() {
  return getFeedback();
}

export async function addPinFn(formData: FormData) {
  const name = formData.get("name") as string;
  const cat = formData.get("cat") as string;
  const pdf = formData.get("pdf") as File;
  const thumb = formData.get("thumb") as File | null;

  if (!pdf) throw new Error("PDF is required");

  const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
  const pdfPath = await saveFile(pdfBuffer, pdf.name, "work");

  let thumbPath = "";
  if (thumb && thumb.size > 0) {
    const thumbBuffer = Buffer.from(await thumb.arrayBuffer());
    thumbPath = await saveFile(thumbBuffer, thumb.name, "thumbs");
  } else {
    const autoThumbBase64 = formData.get("autoThumb") as string;
    if (autoThumbBase64) {
      const base64Data = autoThumbBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      thumbPath = await saveFile(buffer, "thumb.jpg", "thumbs");
    }
  }

  const id = uuidv4();
  addPin({ id, name, cat, pdf_path: pdfPath, thumb_path: thumbPath });
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deletePinFn(id: string) {
  deletePin(id);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function updatePinFn(data: any) {
  updatePin(data);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function addTestimonialFn(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string || "5");
  const avatar = formData.get("avatar") as File | null;

  let avatarPath = "";
  if (avatar && avatar.size > 0) {
    const buffer = Buffer.from(await avatar.arrayBuffer());
    avatarPath = await saveFile(buffer, avatar.name, "avatars");
  }

  const id = uuidv4();
  addTestimonial({ id, name, role, content, rating, avatar_path: avatarPath });
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function sendFeedbackFn(data: any) {
  const { name, email, phone, message } = data;
  const id = uuidv4();
  addFeedback({ id, name, email, phone, message: message || "" });
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteFeedbackFn(id: string) {
  deleteFeedback(id);
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteTestimonialFn(id: string) {
  deleteTestimonial(id);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonialFn(data: any) {
  updateTestimonial(data);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
