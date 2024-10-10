import { AiOutlinePlus } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setChat, setChats } from "../../slices/chatSlice";
import CreateGroup from "./CreateGroup";

const MyChats = ({fetchAgain}) => {
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.fetch.loading);
  const { chat, chats } = useSelector((state) => state.chats);
  const dispatch = useDispatch();

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/chats`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(setChats(data));
      }
    } catch (error) {
      toast.error("Cannot fetch chats");
    }
  };

  useEffect(() => {
    fetchChats();
  }, [dispatch,fetchAgain]);

  const getUsername = (users) => {
    return users[0].username === user.username
      ? users[1].username
      : users[0].username;
  };

  return (
    <div
      className={`${
        chat && "hidden sm:block"
      } col-span-4 sm:col-span-1 bg-slate-200 min-h-[87vh] p-1 sm:p-3 rounded-lg shadow-lg`}
    >
      <header className="flex justify-between items-center w-full bg-white p-3 rounded-md h-16">
        <h2 className="text-xl font-semibold">My Chats</h2>
        <button
          className="flex items-center gap-2 p-2 bg-cyan-100 rounded-md hover:bg-cyan-200 transition duration-200"
          onClick={() => setIsNewGroupOpen(!isNewGroupOpen)}
        >
          <AiOutlinePlus /> <p>New Group</p>
        </button>
        {isNewGroupOpen && (
          <CreateGroup onClose={() => setIsNewGroupOpen(false)} />
        )}
      </header>

      <div className="space-y-2 mt-4 max-h-[calc(80vh-4rem)] overflow-y-scroll scroll-hide">
        {chats &&
          chats.map((c) => (
            <div
              key={c._id}
              className={`flex items-center h-16 gap-3 p-1 sm:p-3 rounded-md cursor-pointer transition duration-200 ${
                c._id === chat?._id
                  ? "bg-green-500 hover:bg-green-500"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={() => dispatch(setChat(c))}
            >
              <img
                src={
                  !c.isGroupChat
                    ? c.users[0].username === user.username
                      ? c.users[1].profilePic
                      : c.users[0].profilePic
                    : c.groupProfilePic
                }
                alt={getUsername(c.users)}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">
                  {!c.isGroupChat ? getUsername(c.users) : c.chatName}
                </p>
                <p className="text-sm">
                  {c.latestMessage?.sender.username === user.username
                    ? "You: "
                    : c.isGroupChat && c.latestMessage?.sender.username + ": "}
                  {c.latestMessage?.content.split(" ").slice(0, 3).join(" ")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyChats;
