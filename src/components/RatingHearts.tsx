'use client';

import { FC, MouseEventHandler, useRef, useState } from "react";
import { RatingHeart, RatingHeartProps } from "./RatingHeart";
import clsx from "clsx";


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
    <div className={clsx('rating rating-lg flex justify-center', hasAlreadyVoted ? 'rating-half' : '')} onMouseLeave={() => setHoverRating(null)}>
      <RatingHeart {...commonProps} value={1} isHalf={hasAlreadyVoted} />
      <RatingHeart {...commonProps} value={2} isHalf={hasAlreadyVoted} />
      <RatingHeart {...commonProps} value={3} isHalf={hasAlreadyVoted} />
      <RatingHeart {...commonProps} value={4} isHalf={hasAlreadyVoted} />
      <RatingHeart {...commonProps} value={5} isHalf={hasAlreadyVoted} />
    </div>
  );
};

export { RatingHearts };
