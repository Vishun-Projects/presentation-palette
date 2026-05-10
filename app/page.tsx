import { getPins, getTestimonials } from "@/src/lib/db";
import LandingPage from "./LandingPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [pins, testimonials] = await Promise.all([getPins(), getTestimonials()]);

  return <LandingPage pins={pins} testimonials={testimonials} />;
}
