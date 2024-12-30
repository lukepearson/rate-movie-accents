'use client'

import { Chat } from "@/app/models/Chat";
import { Rating } from "@/app/models/Rating";
import { FC, useRef, useState } from "react";
import { ChatItem } from "./ChatItem";
import Loading from "@/app/loading";
import { motion, AnimatePresence } from "framer-motion";

interface ChatRendererProps {
  chat: Array<Chat>;
  rating: Rating;
  submitChatMessage: (formData: FormData) => Promise<void>;
}

const ChatRenderer: FC<ChatRendererProps> = ({ chat, rating, submitChatMessage }) => {
  const chatRef = useRef<HTMLTextAreaElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await submitChatMessage(formData);
      chatRef.current!.value = "";
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gray-900 border-2 border-indigo-500 rounded-md'>
      <button onClick={() => setIsOpen(!isOpen)} className="text-xl w-full font-medium hover:bg-gray-800 p-4">Comments</button>
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
      <div className="max-w-sm">

        {isLoading ? <Loading /> : <>

        {chat.map((message) => (
          <ChatItem key={message.created_at} chat={message} />
        ))}
      </>}
      </div>

      <h2 className="mt-2">Add a comment</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-4 p-4">
        <input required minLength={3} name="author" maxLength={30} className="input input-bordered input-primary w-full max-w-sm text-sm placeholder-gray-500" placeholder="Your name" />
        <textarea required minLength={3} ref={chatRef} maxLength={500} name="message" className="textarea textarea-primary w-full max-w-sm text-sm placeholder-gray-500" placeholder="Your comment"></textarea>
        <input hidden name="ratingId" value={rating.id} onChange={() => {}} />
        <button className="btn btn-primary w-full max-w-sm">Post</button>
      </form>
      </motion.div>
      ) : null}
      </AnimatePresence>
    </div>
  );
};

export { ChatRenderer };