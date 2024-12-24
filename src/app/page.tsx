import RatingsForm from "./form";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RatingsList } from "@/components/RatingsList";
import { getRatings } from "./store/kv";

export const metadata: Metadata = {
  title: "Rate film accents",
  description: "Find out what people think about film accents",
};

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
        {sortedRatings?.length ? (
          <div>
              <h2>Popular accents</h2>
          </div>
        ) : null}
        <RatingsList ratings={sortedRatings} />
      </div>
    </div>
  );
}
