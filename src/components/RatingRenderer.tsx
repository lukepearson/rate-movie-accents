"use client";

import { Rating } from "@/app/models/Rating";
import { FC } from "react";
import { RatingHearts } from "./RatingHearts";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/navigation";
import { urls } from "@/utilities/Urls";
import BarChart from "./BarChart";


interface RatingProps {
  rating: Rating;
  onChange: (rating: Rating) => void;
}
const RatingRenderer: FC<RatingProps> = ({ rating, onChange }) => {
  const router = useRouter();
  const [votedIds, setVoteIds] = useLocalStorageState<Array<string>>("hasAlreadyVoted", {
    defaultValue: [],
  });
  const hasAlreadyVoted = votedIds.includes(rating.id);

  rating.ratings = { 1: 10000, 2: 10, 3: 10, 4: 10, 5: 10 };

  const handleChange = (newRating: number) => {
    if (hasAlreadyVoted) return;
    console.log('newRating', newRating);
    setVoteIds([...votedIds, rating.id]);
    onChange({
      ...rating,
      rating: newRating,
    });
  };

  return (
    <div
      onClick={() => router.push(urls.rating(rating.actor, rating.film))}
      className="max-w-md mx-auto bg-gray-900 border-4 border-indigo-500 rounded-xl shadow-md overflow-hidden md:max-w-2xl my-4 cursor-pointer hover:bg-gray-800">
      <div className="grid p-8">
        <div className="mb-3">
          <span className="font-bold text-white">{rating.actor}</span>&nbsp;
          <span className="text-primary">in</span>&nbsp;
          <span className="font-bold text-white">{rating.film}</span>
        </div>
        <hr />
        <div className="mt-3">
          <span className="text-sm text-gray-500">Actor: <span className="font-semibold text-white">{rating.nativeAccent}</span></span>
        </div>
        <div className="mt-3">
          <span className="text-sm text-gray-500"> Acting: <span className="font-semibold text-white">{rating.attemptedAccent}</span></span>
        </div>
        
        <div className="flex flex-col justify-between mt-4">
          <div className="text-sm text-gray-500">Votes: <span className="font-bold text-white">{rating.votes ?? 0}</span></div>
        </div>

        <div className="flex flex-col justify-between mt-4">
          <div className="text-sm text-gray-500">
            Average Rating: <span className="font-bold text-white">{Number(rating.rating).toFixed(2) ?? 0}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between mt-4">
          <BarChart ratings={rating.ratings} />
        </div>

        <div className="mt-6">
          <RatingHearts
            hasAlreadyVoted={hasAlreadyVoted}
            onRatingChange={handleChange}
            rating={rating.rating}
          />
          { hasAlreadyVoted && <div className="text-sm mt-5 text-green-500">You have already rated</div>}
        </div>
      </div>
    </div>
  );
};

export { RatingRenderer };