'use client';

import { FC, MouseEventHandler, useRef, useState } from "react";
import { RatingHeart, RatingHeartProps } from "./RatingHeart";


interface RatingHeartsProps {
  hasAlreadyVoted?: boolean;
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RatingHearts: FC<RatingHeartsProps> = ({ rating, hasAlreadyVoted = false, onRatingChange }) => {
  
  const name = useRef(Math.random().toString(36).substring(7)).current;
  const adjustedRating = rating * 2;
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const onChange = (newValue: number) => {
    if (hasAlreadyVoted) return;
    console.log(newValue);
    onRatingChange(newValue / 2);
  };
  const onMouseOver: MouseEventHandler<HTMLInputElement> = (event) => {
    if (hasAlreadyVoted) return;
    setHoverRating(Number(event.currentTarget.value));
  };

  const commonProps: RatingHeartProps = {
    value: 0,
    name,
    rating: adjustedRating,
    hoverRating,
    onMouseOver,
    onChange,
    colour: hasAlreadyVoted ? "green" : "red",
    isDisabled: hasAlreadyVoted,
  }

  return (
    <div className="rating rating-half rating-lg flex justify-center" onMouseLeave={() => setHoverRating(null)}>
      <RatingHeart {...commonProps} value={2} />
      <RatingHeart {...commonProps} value={4} />
      <RatingHeart {...commonProps} value={6} />
      <RatingHeart {...commonProps} value={8} />
      <RatingHeart {...commonProps} value={10} />
    </div>
  );
};

export { RatingHearts };
