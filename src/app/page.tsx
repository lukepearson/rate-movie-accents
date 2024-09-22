import { kv } from "@vercel/kv";
import RatingsForm from "./form";
import { Rating } from "./models/Rating";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RatingRenderer } from "@/components/RatingRenderer";
import { voteOnExistingRating } from "./actions";
import { RatingsList } from "@/components/RatingsList";

export const metadata: Metadata = {
  title: "Rate film accents",
  description: "Find out what people think about film accents",
};

async function getRatings(): Promise<Rating[]> {
  try {
    const itemIds = await kv.zrange<Array<string>>("items_by_score", 0, 100, {
      rev: true,
    });

    if (!itemIds.length) {
      return [];
    }

    const multi = kv.multi();
    itemIds.forEach((id) => {
      multi.hgetall(id);
    });

    return multi.exec();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const ratings = await getRatings();

  if (!ratings) return notFound();

  const sortedRatings = ratings.filter(Boolean).sort((a, b) => {
    if (!a) return 1;
    if (!b) return -1;
    if (Number(a.rating) > Number(b.rating)) return -1;
    if (Number(a.rating) < Number(b.rating)) return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full h-full">
      <div className="items-center justify-center flex flex-col">
        <RatingsForm />
        <div>
          <h2>Popular accents</h2>
        </div>
        <RatingsList ratings={sortedRatings} />
      </div>
    </div>
  );
}
