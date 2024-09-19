import { kv } from "@vercel/kv";
import RatingsForm from "./form";
import { Rating } from "./types";
import { Metadata } from "next";

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

  return (
    <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full rounded-md h-full">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li className="flex flex-col items-center justify-center p-8 bg-primary text-black rounded-lg shadow-md">
          Fix new rating so it sets rated=true in the url
        </li>
        <li className="flex flex-col items-center justify-center p-8 bg-primary text-black rounded-lg shadow-md">
          clear cache on home page after creating new rating
        </li>
        <li className="flex flex-col items-center justify-center p-8 bg-primary text-black rounded-lg shadow-md">
          add comments section to rating form
        </li>
        <li className="flex flex-col items-center justify-center p-8 bg-primary text-black rounded-lg shadow-md">
          Framer motion animate the ratings list to update after voting
        </li>
      </ul>
      <RatingsForm ratings={ratings} />
    </div>
  );
}
