import React from "react";
import Backdrop from "../BackDrop";
import { useDispatch, useSelector } from "react-redux";
import { setChat } from "../../slices/chatSlice";
import { setNotification } from "../../slices/notificationSlice";

const Notification = ({ onClose }) => {
  const { notification } = useSelector((state) => state.notification);
  const updatedNotification = notification.filter((n) => n.sender.username )
  const dispatch = useDispatch();
  const handleClick = (chatFromNotification) => {
    console.log(chatFromNotification);
    dispatch(setChat(chatFromNotification.chat));
    dispatch(setNotification(notification.filter((n) => n !== chatFromNotification)));
    onClose();
  }
  return (
    <Backdrop onClose={onClose} classes="sm:right-72 max-w-xs">
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto scroll">
        {!notification.length && (
          <p className="text-gray-500 text-center">No notifications</p>
        )}
        {updatedNotification.map((note) => (
             <div
             key={note._id}
             className="flex items-center gap-3 p-2 rounded-md hover:bg-green-300 cursor-pointer"
             onClick={() => handleClick(note)}
           >{note.chat.isGroupChat ? `New message from : ${note.chat.chatName}` : `New message from : ${note.sender.username}`}</div>
        ))}
      </div>
    </Backdrop>
  );
};

export default Notification;
