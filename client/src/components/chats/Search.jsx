import { CgSearch } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import Backdrop from "../BackDrop";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setChat, setChats } from "../../slices/chatSlice";
import { toast } from "react-toastify";

const Search = ({ onClose }) => {
  const { chats } = useSelector((state) => state.chats);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function searchUsers() {
      if (!keyword){
         setUsers([]);
         return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/users?search=${keyword}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      }
    }
    searchUsers();
  }, [keyword]);

  const accessChat = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/chats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        const existingChat = chats.find((c) => c._id === data._id);
        if (!existingChat) {
          dispatch(setChats([data, ...chats]));
        }
        dispatch(setChat(data));
        onClose();
      } else {
        toast.error(data.message || "Cannot access chat or create new chat.");
      }
    } catch (error) {
      toast.error(
        "Something went wrong.Cannot access chat or create new chat."
      );
    }
  };  

  return (
    <Backdrop onClose={onClose} classes="sm:right-40 max-w-xs">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md shadow-sm w-full">
        <CgSearch size={24} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search users..."
          className="h-10 w-full bg-transparent outline-none text-gray-700"
          onChange={(e) => setKeyword(e.target.value)}
          autoFocus
        />
      </div>
      <div className="flex flex-col gap-2 mt-4 max-h-64 overflow-y-auto scroll">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 bg-white rounded-md shadow-sm hover:bg-green-300 cursor-pointer"
              onClick={() => accessChat(user._id)}
            >
              <img
                src={user.profilePic}
                alt={user.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-700 font-medium">{user.username}</p>
                <p className="text-gray-700">{user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No users found</p>
        )}
      </div>
    </Backdrop>
  );
};

export default Search;
