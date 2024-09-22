'use client'

import { Chat } from "@/app/models/Chat";
import { Rating } from "@/app/models/Rating";
import { FC, useRef, useState } from "react";
import { ChatItem } from "./ChatItem";
import Loading from "@/app/loading";

interface ChatRendererProps {
  chat: Array<Chat>;
  rating: Rating;
  submitChatMessage: (formData: FormData) => void;
}

const ChatRenderer: FC<ChatRendererProps> = ({ chat, rating, submitChatMessage }) => {
  const chatRef = useRef<HTMLTextAreaElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      submitChatMessage(formData);
      chatRef.current!.value = "";
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <details className='collapse bg-gray-900 border-2 border-indigo-500 rounded-md'>
      <summary className="collapse-title text-xl font-medium hover:bg-gray-800 pe-4">Comments</summary>
      <div className="collapse-content">

        {isLoading ? <Loading /> : <>

        {chat.map((message) => (
          <ChatItem key={message.created_at} chat={message} />
        ))}
      </>}
      </div>

      <h2>Add a comment</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-4 p-4">
        <input required minLength={3} name="author" maxLength={30} className="input input-bordered input-primary w-full max-w-xs placeholder-gray-500" placeholder="Your name" />
        <textarea required minLength={3} ref={chatRef} maxLength={500} name="message" className="textarea textarea-primary w-full max-w-xs placeholder-gray-500" placeholder="Your comment"></textarea>
        <input hidden name="ratingId" value={rating.id} onChange={() => {}} />
        <button className="btn btn-primary">Post</button>
      </form>
    </details>
  );
};

export { ChatRenderer };