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
    <div className="mb-5">
      <RatingRenderer
        onChange={async (newRating: Rating) => {
          setIsLoading(true);
          await voteOnExistingRating(rating.id, newRating.rating);
          setIsLoading(false);
        }}
        rating={rating}
        isLink={false}
        showStats={true}
        isLoading={isLoading}
      />

      <ChatRenderer chat={chat} rating={rating} submitChatMessage={submitChatMessage} />

      <div className='mt-5'>
        <a href='/' className='link mt-5'>Back</a>
      </div>

    </div>
  );
}

export { ActorRating };