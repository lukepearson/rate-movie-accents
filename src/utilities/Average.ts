import { maxRating, minRating, Rating, RatingSchema } from "@/app/models/Rating";

const isRatingsKey = (key: number): key is keyof Rating['ratings'] => {
  return key in RatingSchema.shape.ratings.shape;
}

function updateRollingAverage(
  rating: Rating,
  newVote: number,
): Rating {
  const parsedNewVote = RatingSchema.partial().parse({ rating: newVote }).rating;
  if (!parsedNewVote) {
    throw new Error("Invalid rating " + newVote);
  }
  const totalVotes = rating.votes + 1;
  const currentAverage = rating.rating;

  const newAverage = (
    currentAverage * rating.votes + parsedNewVote
  ) / totalVotes;

  const newRatings = rating.ratings;
  if (isRatingsKey(newVote)) {
    newRatings[newVote] += 1;
  }

  return {
    ...rating,
    votes: totalVotes,
    rating: Math.min(Math.max(newAverage, minRating), maxRating),
    ratings: newRatings,
  };
}

export { updateRollingAverage };