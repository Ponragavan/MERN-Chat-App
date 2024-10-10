import { BiSend } from "react-icons/bi";
import { RxExit } from "react-icons/rx";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiLeftArrowAlt } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../../slices/chatSlice";
import { toast } from "react-toastify";
import ChatProfile from "../Profile/ChatProfile";
import EditGroup from "../Profile/EditGroup";
import { setLoading } from "../../slices/fetchSlice";
import Messages from "./Messages";
import io from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.fetch.loading);
  const { chat } = useSelector((state) => state.chats);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();

  const getUsername = (users = chat.users) => {
    const username =
      users[0].username === user.username
        ? users[1].username
        : users[0].username;
    setName(username);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    if (!chat) return;
    getUsername();
  }, [dispatch, chat, loading]);

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    if (chat?.isGroupChat && chat?.groupAdmin?._id !== user._id) {
      toast.warning("Only group admin can delete the group");
      return;
    }
    dispatch(setChat(null));
    try {
      dispatch(setLoading(true));
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/deletechat`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ chatId: chat._id }),
        }
      );
      if (response.ok) {
        toast.success("Chat deleted successfully");
      } else {
        toast.error("Can't delete chat");
      }
    } catch (error) {
      toast.error("Cannot delete chat");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    dispatch(setLoading(true));
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupremove`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId: chat._id,
          userId: user._id,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      toast.success("You are no longer a member of this group.");
      dispatch(setChat(null));
      setMessages([]);
    } else {
      toast.error(data.message);
    }
    dispatch(setLoading(false));
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage) return;
    setNewMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ chatId: chat._id, content: newMessage }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      toast.error("Cannot send message");
    }
  };

  const fetchMessages = async () => {
    if (!chat) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/${chat._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
        socket.emit("join chat", chat._id);
      } else {
        toast.error("Error in fetching messages");
      }
    } catch (error) {
      toast.error("Error in fetching messages");
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = chat;
  }, [chat,fetchAgain]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ){
        setFetchAgain(!fetchAgain);
      }else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <div>
      {chat ? (
        <div>
          <header className="bg-white p-3 flex justify-between items-center rounded-md">
            <div className="flex items-center gap-3">
              <BiLeftArrowAlt
                size={40}
                className="cursor-pointer sm:hidden rounded-full bg-slate-200 h-6 w-6 font-semibold"
                onClick={() => dispatch(setChat(null))}
              />
              <img
                src={
                  !chat.isGroupChat
                    ? chat.users[0].username === user.username
                      ? chat.users[1].profilePic
                      : chat.users[0].profilePic
                    : chat.groupProfilePic
                }
                alt={name}
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
                onClick={() => setIsChatProfileOpen(true)}
              />
              <p className="text-xl font-medium">
                {!chat.isGroupChat ? name : chat.chatName}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              {chat.isGroupChat && chat.groupAdmin?._id === user._id && (
                <BiEdit
                  className="cursor-pointer rounded-md h-5 w-5 sm:h-7 sm:w-7 font-semibold"
                  onClick={() => setIsEditting(true)}
                />
              )}
              {chat.isGroupChat && chat.groupAdmin?._id !== user._id && (
                <RxExit
                  className="cursor-pointer rounded-md h-5 w-5 sm:h-7 sm:w-7 font-bold text-red-600"
                  onClick={handleLeave}
                />
              )}
              <RiDeleteBin5Line
                className="cursor-pointer rounded-md h-5 w-5 sm:h-7 sm:w-7 font-semibold"
                onClick={deleteHandler}
              />
            </div>
          </header>
          <Messages messages={messages} />
          <form className="flex" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="flex-grow px-3 py-2 outline-none rounded-md border-2 bg-slate-100 focus:border-slate-400"
              value={newMessage}
              placeholder="Enter a message"
              onChange={handleChange}
              autoFocus
            />
            <button type="submit"></button>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full roumd">
          <p className="text-2xl font-semibold text-gray-400">
            Click On A Chat To Start A Conversation
          </p>
        </div>
      )}
      {isChatProfileOpen && (
        <ChatProfile onClose={() => setIsChatProfileOpen(false)} />
      )}
      {isEditting && <EditGroup onClose={() => setIsEditting(false)} />}
    </div>
  );
};

export default SingleChat;
