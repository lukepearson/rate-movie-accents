'use client';

import { submitExistingRating } from "@/app/actions";
import { Rating } from "@/app/types";
import { RatingRenderer } from "@/components/RatingRenderer";
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import useLocalStorageState from "use-local-storage-state";

interface ActorRatingProps {
  rating: Rating;
}
const ActorRating: FC<ActorRatingProps> = ({ rating }) => {
  const searchParams = useSearchParams();
  const [voteIds, setVoteIds] = useLocalStorageState<Array<string>>("hasAlreadyVoted", {
    defaultValue: [],
  });
  if (searchParams?.get("voted") === "true") {
    setVoteIds((ids) => [...voteIds, rating.id]);
  }
  return (
    <div>
      <RatingRenderer
        onChange={(newRating: Rating) => {
          submitExistingRating(rating.id, newRating.rating);
        }}
        rating={rating}
      />

      <details className="collapse bg-base-200">
        <summary className="collapse-title text-xl font-medium">Comments</summary>
        <div className="collapse-content">
          <div className="chat chat-start">
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">I loved you.</div>
              <div className="chat-footer opacity-50">Delivered</div>
          </div>
        </div>

        <h2>Add a comment</h2>
        <div className="flex flex-col items-center gap-4 p-4">
          <input className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500" placeholder="Your name" />
          <textarea className="textarea textarea-primary w-full max-w-xs placeholder-gray-500" placeholder="Your comment" maxLength={120}></textarea>
          <span className="text-muted">Max 120 characters</span>

          <button className="btn btn-primary">Post</button>
        </div>
      </details>
      

      <nav className="my-8">
        <a href="/">Back to home page</a>
      </nav>
    </div>
  );
}

export { ActorRating };