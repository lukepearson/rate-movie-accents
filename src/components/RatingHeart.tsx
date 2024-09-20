'use client';

import clsx from "clsx";
import { ChangeEventHandler, FC, MouseEventHandler } from "react";

interface RatingHeartProps {
  rating: number;
  hoverRating: number | null;
  onChange: (rating: number) => void;
  onMouseOver: MouseEventHandler<HTMLInputElement>;
  value: number;
  colour: string;
  name: string;
  isDisabled: boolean;
}

const RatingHeart: FC<RatingHeartProps> = ({ rating, hoverRating, onChange, onMouseOver, value, colour, name, isDisabled }) => {
  const firstHalf = value - 1;
  const activeRating = hoverRating ?? rating;
  const isFirstHalfActive = Boolean(activeRating >= firstHalf);
  const isSecondHalfActive = Boolean(activeRating >= value);
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
        onMouseOver={onMouseOver} value={firstHalf} 
        checked={isFirstHalfActive}
        className={`${styles} mask-half-1`}
      />
      <input 
        disabled={isDisabled}
        type="radio" name={name} onChange={handleChange}
        onClick={handleClick}
        onMouseOver={onMouseOver} value={value} 
        checked={isSecondHalfActive}
        className={`${styles} mask-half-2 me-2`}
      />
    </>
  );
};

export { RatingHeart };
export type { RatingHeartProps };