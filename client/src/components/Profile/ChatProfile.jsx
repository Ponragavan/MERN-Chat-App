import React, { useEffect, useState } from "react";
import Backdrop from "../BackDrop";
import { useSelector } from "react-redux";
import { RiAdminLine } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";

const ChatProfile = ({onClose}) => {
  const user = useSelector((state) => state.user.user);
  const { chat } = useSelector((state) => state.chats);
  const [name, setName] = useState("");

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
  return (
    <Backdrop onClose={onClose} classes={"sm:max-w-sm"}>
      <div className="flex flex-col items-center gap-5">
        <img
          src={
            !chat.isGroupChat
              ? chat.users[0].username === user.username
                ? chat.users[1].profilePic
                : chat.users[0].profilePic
              : chat.groupProfilePic
          }
          alt={name}
          className="h-32 w-32 rounded-full object-cover"
        />
        <div className="flex items-center gap-3">
          <p className="text-xl font-semibold">
            {chat.isGroupChat ? chat.chatName : name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {chat.isGroupChat ? (
            <>
              <RiAdminLine size={25} />{" "}
              <p className="text-lg font-semibold">
                {chat.groupAdmin.username}
              </p>
            </>
          ) : (
            <>
              <HiOutlineMail size={25} />
              <p className="text-lg font-semibold">
                {chat.users[0].username === name
                  ? chat.users[0].email
                  : chat.users[1].email}
              </p>
            </>
          )}
        </div>
        <p className="text-lg font-medium text-gray-500">
          {chat.isGroupChat ? "Group Chat" : "Personal Chat"}
        </p>
      </div>
    </Backdrop>
  );
};

export default ChatProfile;
