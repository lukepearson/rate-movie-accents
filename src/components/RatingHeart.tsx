'use client';

import clsx from "clsx";
import { ChangeEventHandler, FC, MouseEventHandler } from "react";

interface RatingHeartProps {
  rating: number;
  hoverRating: number | null;
  onChange: (rating: number) => void;
  onMouseOver: MouseEventHandler<HTMLInputElement>;
  value: number;
  name: string;
  isDisabled: boolean;
}

const RatingHeart: FC<RatingHeartProps> = ({ rating, hoverRating, onChange, onMouseOver, value, name, isDisabled }) => {
  const activeRating = hoverRating ?? rating;
  const isActive = Boolean(activeRating >= value);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (isDisabled) return;
    onChange(Number(event.currentTarget.value));
  };
  const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
    if (isDisabled) return;
    onChange(Number(event.currentTarget.value));
  }
  const cursorStyle = isDisabled ? "cursor-not-allowed" : "cursor-pointer";
  const styles = clsx(`mask mask-heart bg-primary`, cursorStyle);
  return (
    <>
      <input 
        disabled={isDisabled}
        type="radio" name={name} onChange={handleChange}
        onClick={handleClick}
        onMouseOver={onMouseOver} value={value} 
        checked={isActive}
        className={`${styles} mask me-2`}
      />
    </>
  );
};

export { RatingHeart };
export type { RatingHeartProps };