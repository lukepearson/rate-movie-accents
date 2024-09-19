import { maxRating, minRating, Rating, RatingSchema } from "@/app/types";

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

  return {
    ...rating,
    votes: totalVotes,
    rating: Math.min(Math.max(newAverage, minRating), maxRating),
  }
}

export { updateRollingAverage };