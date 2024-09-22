"use client";

import { Rating } from "@/app/models/Rating";
import { RatingRenderer } from "./RatingRenderer";
import { voteOnExistingRating } from "@/app/actions";
import { FC, useState } from "react";

interface RatingsListProps {
  ratings: Array<Rating>;
}

const RatingsList: FC<RatingsListProps> = ({ ratings }) => {
  const [isLoading, setIsLoading] = useState(false);
  if (!ratings.length) {
    return <div>No ratings found</div>;
  }
  return (
    <div>
      {ratings.map((rating: Rating, index: number) => (
        <RatingRenderer
          key={rating.id}
          onChange={async (newRating) => {
            setIsLoading(true);
            voteOnExistingRating(rating.id, newRating.rating)
            setIsLoading(false);
          }}
          rating={rating}
          isLink
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export { RatingsList };