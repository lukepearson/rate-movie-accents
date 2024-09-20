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
  isHalf?: boolean;
}

const RatingHeart: FC<RatingHeartProps> = ({ rating, hoverRating, onChange, onMouseOver, value, name, isDisabled, isHalf }) => {
  const activeRating = hoverRating ?? rating;
  const isActive = Boolean(activeRating >= value);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (isDisabled) return;
    onChange(Number(event.currentTarget.value));
  };
  const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
    if (isDisabled) return;
    onChange(Number(event.currentTarget.value));
    event.stopPropagation();
    event.preventDefault();
  }
  const cursorStyle = isDisabled ? "cursor-not-allowed" : "cursor-pointer";
  const maskStyle = isHalf ? "mask-1" : "mask-0";
  const styles = clsx(`mask mask-heart bg-primary`, cursorStyle, maskStyle);
  return (
    <>
    {isHalf && (
      <input 
        disabled
        type="radio"
        name={name}
        checked={isActive && value === 1}
        className={`${styles} mask mask-half-1 ms-2`}
      />
    )}
      <input
        disabled={isDisabled}
        type="radio" name={name}
        onChange={handleChange}
        onClick={handleClick}
        onMouseOver={onMouseOver} value={value} 
        checked={isActive}
        className={clsx(styles, 'mask me-2', isHalf && 'mask-half-2')}
      />
    </>
  );
};

export { RatingHeart };
export type { RatingHeartProps };