"use client";

import { getIdsFromRatingId, Rating } from "@/app/models/Rating";
import { FC, useState } from "react";
import { RatingHearts } from "./RatingHearts";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/navigation";
import { urls } from "@/utilities/Urls";
import BarChart from "./BarChart";
import clsx from "clsx";
import Loading from "@/app/loading";
import { preventBubbles } from "@/utilities/Handlers";
import { motion, AnimatePresence } from "framer-motion";


interface RatingProps {
  rating: Rating;
  onChange: (rating: Rating) => void;
  isLink?: boolean;
  showStats?: boolean;
  isLoading?: boolean;
}
const RatingRenderer: FC<RatingProps> = ({ rating, onChange, isLink, isLoading, showStats }) => {
  const router = useRouter();
  const [votedIds, setVoteIds] = useLocalStorageState<Array<string>>("hasAlreadyVoted", {
    defaultValue: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const hasAlreadyVoted = votedIds.includes(rating.id);

  const handleChange = (newRating: number) => {
    console.log('RatingRenderer.handleChange', { hasAlreadyVoted, ratingId: rating.id, votedIds });
    if (hasAlreadyVoted) return;
    setVoteIds([...votedIds, rating.id]);
    onChange({
      ...rating,
      rating: newRating,
    });
  };

  const linkClasses = isLink ? 'cursor-pointer hover:border-indigo-300 hover:mix-blend-normal' : '';

  return (
    <div
      style={{ backgroundImage: `url(https://media.themoviedb.org/t/p/w220_and_h330_face/${rating.filmImagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backfaceVisibility: 'hidden',
        backdropFilter: 'blur(20px)',
        backgroundBlendMode: 'luminosity',
      }}
      onClick={() => isLink && router.push(urls.rating(...getIdsFromRatingId(rating.id)))}
      className={clsx('relative max-w-md mx-auto bg-gray-900 border-2 border-indigo-500 rounded-md shadow-md overflow-hidden md:max-w-2xl my-4 p-8', linkClasses)}>
      <div
        className={clsx('grid bg-gray-800 bg-opacity-80 p-3')}>

        <div className="avatar mx-auto p-5">
          <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
            <img alt={rating.actor} src={`https://media.themoviedb.org/t/p/w220_and_h330_face/${rating.actorImagePath}`} />
          </div>
        </div>

        <div className="mb-3">
          <span className="font-bold text-white">{rating.actor}</span>&nbsp;
          <span className="text-primary">in</span>&nbsp;
          <span className="font-bold text-white">{rating.film}</span>
        </div>
        <hr />
        <div className="mt-3">
          <span className="text-sm text-gray-300">Actor: <span className="font-semibold text-white">{rating.nativeAccent}</span></span>
        </div>
        <div className="mt-3">
          <span className="text-sm text-gray-300"> Acting: <span className="font-semibold text-white">{rating.attemptedAccent}</span></span>
        </div>

        <div className="mt-6">
          <RatingHearts
            hasAlreadyVoted={hasAlreadyVoted}
            onRatingChange={handleChange}
            rating={rating.rating}
          />
          { hasAlreadyVoted && <div className="text-sm mt-5 text-green-500">Thanks for rating!</div>}
        </div>
      </div>

      
      {showStats && (
        
        <div className='bg-gray-900 rounded-none'>
          <button {...preventBubbles()} onClick={() => setIsOpen(!isOpen)} className="text-xl w-full font-medium hover:bg-gray-800 p-4">Stats</button>
          <AnimatePresence>
            {isOpen ? (
            <motion.div
              key="stats"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
            <div>
              <div className="flex flex-col justify-between mt-4">
                Ratings distribution
                <BarChart ratings={rating.ratings} />
              </div>

              <div className="stats shadow mt-4">
                <div className="stat">
                  <div className="stat-title text-gray-500">Votes</div>
                  <div className="stat-value text-white">{rating.votes ?? 0}</div>
                </div>

                <div className="stat">
                  <div className="stat-title text-gray-500">Average Rating</div>
                  <div className="stat-value text-white">{Number(rating.rating).toFixed(2) ?? 0}</div>
                </div>
              </div>
            </div>
            </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}

      {isLoading && (
        <div
          id="loading-overlay"
          className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70"
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export { RatingRenderer };