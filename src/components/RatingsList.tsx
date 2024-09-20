"use client";

import { Rating } from "@/app/models/Rating";
import { RatingRenderer } from "./RatingRenderer";
import { voteOnExistingRating } from "@/app/actions";
import { FC } from "react";

interface RatingsListProps {
  ratings: Array<Rating>;
}

const RatingsList: FC<RatingsListProps> = ({ ratings }) => {
  if (!ratings.length) {
    return <div>No ratings found</div>;
  }
  return (
    <div className="items-center justify-center flex flex-col">
      {ratings.map((rating: Rating, index: number) => (
        <RatingRenderer
          key={rating.id}
          onChange={(newRating) => {
            voteOnExistingRating(rating.id, newRating.rating)
          }}
          rating={rating}
          isLink
        />
      ))}
    </div>
  );
};

export { RatingsList };