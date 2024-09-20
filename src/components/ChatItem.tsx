import { Chat } from "@/app/models/Chat";
import { formatDistanceToNow } from "date-fns";
import { FC } from "react";

interface ChatItemProps {
  chat: Chat;
}

const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const timeDelta = formatDistanceToNow(chat.created_at, { addSuffix: true });
  return (
    <div className="chat chat-start">
      <div className="chat-header">
        {chat.author}
        <time className="text-xs opacity-50 ps-2">{timeDelta}</time>
      </div>
      <div className="chat-bubble">{chat.message}</div>
    </div>
  );
};

export { ChatItem };