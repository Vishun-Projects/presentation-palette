import { createServerFn } from "@tanstack/react-start";
import { addFeedback, addPin, addTestimonial, deleteFeedback, deletePin, deleteTestimonial, getFeedback, getPins, getTestimonials, updatePin, updateTestimonial } from "./db";
import { saveFile } from "./files";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

export const getPinsFn = createServerFn({ method: "GET" }).handler(async () => {
  return getPins();
});

export const getTestimonialsFn = createServerFn({ method: "GET" }).handler(async () => {
  return getTestimonials();
});

export const getFeedbackFn = createServerFn({ method: "GET" }).handler(async () => {
  return getFeedback();
});

export const addPinFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const formData = ctx.data instanceof FormData ? ctx.data : ctx.data?.data;
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
    
    return { success: true };
  });

export const deletePinFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const id = ctx.data?.data || ctx.data || ctx;
    deletePin(id);
    return { success: true };
  });

export const updatePinFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data?.data || ctx.data || ctx;
    updatePin(data);
    return { success: true };
  });

export const addTestimonialFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const formData = ctx.data instanceof FormData ? ctx.data : ctx.data?.data;
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
    
    return { success: true };
  });

export const sendFeedbackFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data?.data || ctx.data || ctx;
    const { name, email, phone, message } = data;
    const id = uuidv4();
    addFeedback({ id, name, email, phone, message: message || "" });
    return { success: true };
  });

export const deleteFeedbackFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const id = ctx.data?.data || ctx.data || ctx;
    deleteFeedback(id);
    return { success: true };
  });

export const deleteTestimonialFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const id = ctx.data?.data || ctx.data || ctx;
    deleteTestimonial(id);
    return { success: true };
  });

export const updateTestimonialFn = createServerFn({ method: "POST" })
  .handler(async (ctx: any) => {
    const data = ctx.data?.data || ctx.data || ctx;
    updateTestimonial(data);
    return { success: true };
  });
