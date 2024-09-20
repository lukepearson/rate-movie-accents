"use client";

import { Rating } from "@/app/models/Rating";
import { FC } from "react";
import { RatingHearts } from "./RatingHearts";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/navigation";
import { urls } from "@/utilities/Urls";
import BarChart from "./BarChart";
import clsx from "clsx";
import Loading from "@/app/loading";
import { preventBubbles } from "@/utilities/Handlers";


interface RatingProps {
  rating: Rating;
  onChange: (rating: Rating) => void;
  isLink?: boolean;
  isLoading?: boolean;
}
const RatingRenderer: FC<RatingProps> = ({ rating, onChange, isLink, isLoading }) => {
  const router = useRouter();
  const [votedIds, setVoteIds] = useLocalStorageState<Array<string>>("hasAlreadyVoted", {
    defaultValue: [],
  });
  const hasAlreadyVoted = votedIds.includes(rating.id);

  const handleChange = (newRating: number) => {
    if (hasAlreadyVoted) return;
    setVoteIds([...votedIds, rating.id]);
    onChange({
      ...rating,
      rating: newRating,
    });
  };

  const linkClasses = isLink ? 'cursor-pointer hover:bg-gray-800' : '';

  return (
    <div
      onClick={() => isLink && router.push(urls.rating(rating.actor, rating.film))}
      className={clsx('relative max-w-md mx-auto bg-gray-900 border-2 border-indigo-500 rounded-md shadow-md overflow-hidden md:max-w-2xl my-4', linkClasses)}>
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

        <div className="mt-6">
          <RatingHearts
            hasAlreadyVoted={hasAlreadyVoted}
            onRatingChange={handleChange}
            rating={rating.rating}
          />
          { hasAlreadyVoted && <div className="text-sm mt-5 text-green-500">You have already rated</div>}
        </div>

        <details className='collapse bg-gray-900'>
          <summary {...preventBubbles()} className="collapse-title text-xl font-medium hover:bg-gray-800 pe-4">Stats</summary>
          <div className="collapse-content">
            <div className="flex flex-col justify-between mt-4">
              <BarChart ratings={rating.ratings} />
            </div>

            <div className="stats shadow mt-4">
              <div className="stat">
                <div className="stat-title text-gray-500">Votes</div>
                <div className="stat-value text-white">{rating.votes ?? 0}</div>
              </div>

              <div className="stat">
                <div className="stat-title text-gray-500">Average Rating</div>
                <div className="stat-value text-white">{Number(rating.rating).toFixed(2) ?? 0}</div>
              </div>
            </div>
          </div>
        </details>

      </div>

      {isLoading && (
        <div
          id="loading-overlay"
          className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70"
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export { RatingRenderer };