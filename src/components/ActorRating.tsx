'use client';

import { submitChatMessage, voteOnExistingRating } from "@/app/actions";
import { Rating } from "@/app/models/Rating";
import { Chat } from "@/app/models/Chat";
import { RatingRenderer } from "@/components/RatingRenderer";
import { useSearchParams } from "next/navigation";
import { FC, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { ChatItem } from "./ChatItem";
import clsx from "clsx";

interface ActorRatingProps {
  rating: Rating;
  chat: Array<Chat>;
}
const ActorRating: FC<ActorRatingProps> = ({ rating, chat }) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [voteIds, setVoteIds] = useLocalStorageState<Array<string>>("hasAlreadyVoted", {
    defaultValue: [],
  });
  if (searchParams?.get("voted") === "true") {
    setVoteIds((ids) => [...voteIds, rating.id]);
  }
  const chatRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div>
      <RatingRenderer
        onChange={async (newRating: Rating) => {
          setIsLoading(true);
          await voteOnExistingRating(rating.id, newRating.rating);
          setIsLoading(false);
        }}
        rating={rating}
        isLink={false}
        isLoading={isLoading}
      />

      <details className='collapse bg-gray-900 border-2 border-indigo-500'>
        <summary className="collapse-title text-xl font-medium hover:bg-gray-800 pe-4">Comments</summary>
        <div className="collapse-content">
          {chat.map((message) => (
            <ChatItem key={message.created_at} chat={message} />
          ))}
        </div>

        <h2>Add a comment</h2>
        <form action={(formData) => {
          submitChatMessage(formData)
          chatRef.current!.value = ""
        }} className="flex flex-col items-center gap-4 p-4">
          <input name="author" maxLength={30} className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500" placeholder="Your name" />
          <textarea ref={chatRef} maxLength={120} name="message" className="textarea textarea-primary w-full max-w-xs placeholder-gray-500" placeholder="Your comment"></textarea>
          <input hidden name="ratingId" value={rating.id} onChange={() => {}} />
          <button className="btn btn-primary">Post</button>
        </form>
      </details>
      

      <nav className="my-8">
        <a href="/">Back to home page</a>
      </nav>
    </div>
  );
}

export { ActorRating };