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
import Messages from "./Messages";
import io from "socket.io-client";
import Spinner from "../Spinner";
import { setNotification } from "../../slices/notificationSlice";
import { getSender } from "../../ChatLogics";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {notification} = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user.user);
  const { chat } = useSelector((state) => state.chats);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  const getUsername = (users = chat.users) => {
    const username =
      users[0].username === user.username
        ? users[1].username
        : users[0].username;
    setName(username);
  };

  useEffect(() => {
    if (!chat) return;
    getUsername();
  }, [chat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    if (chat?.isGroupChat && chat?.groupAdmin?._id !== user._id) {
      toast.warning("Only group admin can delete the group");
      return;
    }
    try {
      setLoading(true);
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
        setFetchAgain(!fetchAgain);
        setMessages([]);
        dispatch(setChat(null));
      } else {
        toast.error("Can't delete chat");
      }
    } catch (error) {
      toast.error("Cannot delete chat");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    setLoading(true);
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
      setFetchAgain(!fetchAgain);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = chat;    
  }, [chat, fetchAgain]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        const existingNotification = notification.find(
          (notif) => notif.chat._id === newMessageRecieved.chat._id
        );
  
        if (!existingNotification) {
          dispatch(setNotification([newMessageRecieved, ...notification]));
        } else {
          const updatedNotifications = notification.map((notif) =>
            notif.chat._id === newMessageRecieved.chat._id
              ? newMessageRecieved
              : notif
          );
          dispatch(setNotification(updatedNotifications));
        }
  
        setFetchAgain(!fetchAgain);
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  }, [notification, messages, selectedChatCompare, fetchAgain, socket, dispatch]);
  

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
                alt={chat.isGroupChat ? chat.chatName : name}
                className="h-10 w-10 rounded-full object-cover cursor-pointer"
                onClick={() => setIsChatProfileOpen(true)}
              />
              <p className="text-xl font-medium">
              {chat.isGroupChat ? chat.chatName : name}
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
          {loading && !messages ? (
            <Spinner size="lg" layout="h-[70vh]" />
          ) : (
            <>
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
            </>
          )}
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
      {isEditting && <EditGroup fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} onClose={() => setIsEditting(false)} />}
    </div>
  );
};

export default SingleChat;
