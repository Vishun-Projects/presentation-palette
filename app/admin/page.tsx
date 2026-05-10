import { getPins, getTestimonials, getFeedback } from "@/src/lib/db";
import AdminPage from "./AdminPage";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const [pins, testimonials, feedbacks] = await Promise.all([
    getPins(), 
    getTestimonials(), 
    getFeedback()
  ]);

  return (
    <AdminPage 
      initialPins={pins} 
      initialTestimonials={testimonials} 
      initialFeedbacks={feedbacks} 
    />
  );
}
