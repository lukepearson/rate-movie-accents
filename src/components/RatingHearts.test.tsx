import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RatingHearts } from './RatingHearts';
import { RatingHeart } from './RatingHeart';

jest.mock('./RatingHeart', () => ({
  RatingHeart: jest.fn(({ value, rating, hoverRating, isDisabled, onMouseOver, onChange }) => (
    <button
      data-testid={`rating-heart-${value}`}
      onMouseOver={onMouseOver}
      onClick={() => !isDisabled && onChange(value)}
      disabled={isDisabled}
    >
      {hoverRating ? hoverRating : rating}
    </button>
  )),
}));

describe('RatingHearts Component', () => {
  const onRatingChangeMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders five RatingHeart components', () => {
    render(<RatingHearts rating={3} onRatingChange={onRatingChangeMock} />);

    // Check if 5 rating hearts are rendered
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-heart-${i}`)).toBeInTheDocument();
    }
  });

  it('calls onRatingChange with correct value when heart is clicked', () => {
    render(<RatingHearts rating={3} onRatingChange={onRatingChangeMock} />);

    // Click on the third heart
    const ratingHeart = screen.getByTestId('rating-heart-3');
    fireEvent.click(ratingHeart);

    expect(onRatingChangeMock).toHaveBeenCalledWith(3);
  });

  it('does not call onRatingChange when hasAlreadyVoted is true', () => {
    render(<RatingHearts rating={3} hasAlreadyVoted={true} onRatingChange={onRatingChangeMock} />);

    // Try to click on the third heart when user has already voted
    const ratingHeart = screen.getByTestId('rating-heart-3');
    fireEvent.click(ratingHeart);

    expect(onRatingChangeMock).not.toHaveBeenCalled();
  });

  it('disables hearts if hasAlreadyVoted is true', () => {
    render(<RatingHearts rating={3} hasAlreadyVoted={true} onRatingChange={onRatingChangeMock} />);

    // Check that hearts are disabled
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-heart-${i}`)).toBeDisabled();
    }
  });

  it('enables hearts if hasAlreadyVoted is false', () => {
    render(<RatingHearts rating={3} hasAlreadyVoted={false} onRatingChange={onRatingChangeMock} />);

    // Check that hearts are not disabled
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-heart-${i}`)).not.toBeDisabled();
    }
  });
});
