'use client';

import { submitChatMessage, voteOnExistingRating } from "@/app/actions";
import { Rating } from "@/app/models/Rating";
import { Chat } from "@/app/models/Chat";
import { RatingRenderer } from "@/components/RatingRenderer";
import { useSearchParams } from "next/navigation";
import { FC, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { ChatRenderer } from "./ChatRenderer";

interface ActorRatingProps {
  rating: Rating;
  chat: Array<Chat>;
}
const ActorRating: FC<ActorRatingProps> = ({ rating, chat }) => {
  const [isLoading, setIsLoading] = useState(false);

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

      <ChatRenderer chat={chat} rating={rating} submitChatMessage={submitChatMessage} />

      <nav className="my-8">
        <a href="/">Back to home page</a>
      </nav>
    </div>
  );
}

export { ActorRating };