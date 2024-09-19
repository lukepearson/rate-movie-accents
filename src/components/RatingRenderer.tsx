"use client";

import { Rating } from "@/app/types";
import { FC } from "react";
import { RatingHearts } from "./RatingHearts";
import ArrowRight from '@heroicons/react/16/solid/ArrowsRightLeftIcon';
import useLocalStorageState from "use-local-storage-state";
import { urls } from "@/utilities/Urls";

interface RatingProps {
  rating: Rating;
  onChange: (rating: Rating) => void;
}
const RatingRenderer: FC<RatingProps> = ({ rating, onChange }) => {
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
  }
  return (
    <div className="p-6 mx-8 flex items-center">
      <div className="stats stats-horizontal shadow bg-accent-content">
        <div className="stat">
          <div className="stat-title">{rating.film}</div>
          <div className="stat-value"><a href={urls.rating(rating.actor, rating.film)}>{rating.actor}</a></div>
        </div>
        <div className="stat">
          <span>{rating.nativeAccent} <ArrowRight /> {rating.attemptedAccent}</span>
        </div>
        <div className="stat">
          <div className="stat-title">Votes</div>
          <div className="stat-value">{rating.votes ?? 0}</div>
          <div className="stat-desc text-secondary">Average ({Number(rating.rating).toFixed(2) ?? 0})</div>
        </div>
        <div className="stat">
          <div className="stat-title">Submit Rating</div>
          {hasAlreadyVoted && <div className="stat-desc">Already rated</div>}
          <div className={`stat-value ${hasAlreadyVoted && 'opacity-60'}`}>
            <RatingHearts
              hasAlreadyVoted={hasAlreadyVoted}
              onRatingChange={handleChange}
              rating={rating.rating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { RatingRenderer };