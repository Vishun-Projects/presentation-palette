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
  const pdf = formData.get("pdf") as File | null;
  const pdfUrl = formData.get("pdfUrl") as string | null;
  const thumb = formData.get("thumb") as File | null;
  const thumbUrl = formData.get("thumbUrl") as string | null;

  if (!pdf && !pdfUrl) throw new Error("PDF is required");

  let pdfPath = pdfUrl || "";
  if (pdf && pdf.size > 0 && !pdfUrl) {
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    pdfPath = await saveFile(pdfBuffer, pdf.name, "work");
  }

  let thumbPath = thumbUrl || "";
  if (thumb && thumb.size > 0 && !thumbUrl) {
    const thumbBuffer = Buffer.from(await thumb.arrayBuffer());
    thumbPath = await saveFile(thumbBuffer, thumb.name, "thumbs");
  } else if (!thumbUrl) {
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

export async function updatePinFn(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const cat = formData.get("cat") as string;
  const pdf = formData.get("pdf") as File | null;
  const pdfUrl = formData.get("pdfUrl") as string | null;
  const thumb = formData.get("thumb") as File | null;
  const thumbUrl = formData.get("thumbUrl") as string | null;

  const updates: any = { id, name, cat };

  if (pdfUrl) {
    updates.pdf_path = pdfUrl;
  } else if (pdf && pdf.size > 0) {
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    updates.pdf_path = await saveFile(pdfBuffer, pdf.name, "work");
  }

  if (thumbUrl) {
    updates.thumb_path = thumbUrl;
  } else if (thumb && thumb.size > 0) {
    const thumbBuffer = Buffer.from(await thumb.arrayBuffer());
    updates.thumb_path = await saveFile(thumbBuffer, thumb.name, "thumbs");
  } else {
    const autoThumbBase64 = formData.get("autoThumb") as string;
    if (autoThumbBase64) {
      const base64Data = autoThumbBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      updates.thumb_path = await saveFile(buffer, "thumb.jpg", "thumbs");
    }
  }

  updatePin(updates);
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
