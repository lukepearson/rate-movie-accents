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
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const onChange = (newValue: number) => {
    if (hasAlreadyVoted) return;
    onRatingChange(newValue);
  };
  const onMouseOver: MouseEventHandler<HTMLInputElement> = (event) => {
    if (hasAlreadyVoted) return;
    setHoverRating(Number(event.currentTarget.value));
  };

  const commonProps: RatingHeartProps = {
    value: 0,
    name,
    rating: rating,
    hoverRating,
    onMouseOver,
    onChange,
    isDisabled: hasAlreadyVoted,
  }

  return (
    <div className="rating rating-lg flex justify-center" onMouseLeave={() => setHoverRating(null)}>
      <RatingHeart {...commonProps} value={1} />
      <RatingHeart {...commonProps} value={2} />
      <RatingHeart {...commonProps} value={3} />
      <RatingHeart {...commonProps} value={4} />
      <RatingHeart {...commonProps} value={5} />
    </div>
  );
};

export { RatingHearts };
