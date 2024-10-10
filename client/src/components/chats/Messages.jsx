import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { isSameSender, isSameSenderMargin, isSameUser } from "../../ChatLogics";
import { isLastMessage } from "../../ChatLogics";

const Messages = ({ messages,isTyping }) => {
  const user = useSelector((state) => state.user.user);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col p-1 sm:p-3 sm:mt-1 mt-2 gap-1 h-[70vh] overflow-y-auto scroll"
    >
      {messages?.map((message, i) => (
        <div key={message._id} className="flex items-center text-sm gap-2">
          {(isSameSender(messages, message, i, user._id) ||
            isLastMessage(messages, i, user._id)) && (
            <img
              src={message.sender.profilePic}
              alt={message.sender.username}
              title={message.sender.username}
              className="w-8 h-8 rounded-full object-cover bg-white"
            />
          )}
          <p
            className={`${
              message.sender._id === user._id
                ? "bg-green-300 self-end ml-auto"
                : "bg-gray-100"
            } p-1 px-2 rounded-md max-w-[75%] break-words`}
            style={{
              marginLeft: isSameSenderMargin(messages, message, i, user._id),
            }}
          >
            {message.content}
          </p>
        </div>
      ))}
      {isTyping && "Loading" }
    </div>
  );
};

export default Messages;
