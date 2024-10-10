import React, { useEffect, useState } from "react";
import Backdrop from "../BackDrop";
import { AiOutlineClose } from "react-icons/ai";
import { setChat, setChats } from "../../slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../slices/searchSlice";
import { toast } from "react-toastify";

const EditGroup = ({ onClose }) => {
  const keyword = useSelector((state) => state.search.keyword);
  const { chat } = useSelector((state) => state.chats);
  const [groupName, setGroupName] = useState(chat.chatName);
  const [selectedMembers, setSelectedMembers] = useState(chat.users);
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    async function searchUsers() {
      if (!keyword) {
        setSearchResults([]);
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
        setSearchResults(data.users);
      }
    }
    searchUsers();
  }, [keyword, dispatch]);

  const handleAddMember = async (user) => {
    if (selectedMembers.some((member) => member._id === user._id)) {
      toast.warn("User already added to the group");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`,
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
      const updatedChat = { ...chat, users: [...selectedMembers, user] };
      setSelectedMembers(updatedChat.users);
      dispatch(setChat(updatedChat));
      toast.success("User added to group successfully");
      dispatch(setSearchKeyword(""));
    } else {
      toast.error(data.message);
    }
  };
  
  const handleDelete = async (user) => {
    if (chat?.isGroupChat && chat?.groupAdmin?._id === user._id) {
      toast.warning("Admin can't be removed from the group");
      return;
    }
    
    const updatedMembers = selectedMembers.filter(
      (member) => member._id !== user._id
    );
    setSelectedMembers(updatedMembers);
  
    try {
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
        const updatedChat = { ...chat, users: updatedMembers };
        setSelectedMembers(updatedChat.users);
        dispatch(setChat(updatedChat));
        toast.success("User removed from group successfully");
      } else {
        toast.error(data.message || "Failed to remove user from the group");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  
  

  const handleRename = async () => {
    if (!groupName) {
      toast.error("Group name is required");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId: chat._id,
          name: groupName,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      toast.success("Group name updated successfully");
      dispatch(setChat({ ...chat, chatName: groupName }));
    } else {
      toast.error(data.message);
    }
  };
  return (
    <Backdrop
      classes="relative max-w-lg top-5 overflow-y-hidden"
      onClose={onClose}
    >
      <header className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Edit Your Group</h2>
        <button onClick={onClose}>
          <AiOutlineClose size={25} />
        </button>
      </header>
      <div className="mt-4 space-y-4 mb-3">
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium">
            Group Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={groupName}
              className="mt-1 block flex-grow px-3 py-2 border-gray-300 rounded-md shadow-sm outline-none focus:border-2 focus:border-cyan-500"
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button
              onClick={handleRename}
              className="px-5 py-2 mt-1 transition-all bg-cyan-500 hover:bg-cyan-600 rounded-md text-white"
            >
              Update
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="group-members" className="block text-sm font-medium">
            Add Members
          </label>
          <input
            type="text"
            id="group-members"
            name="group-members"
            className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm outline-none focus:border-2 focus:border-cyan-500"
            onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
            value={keyword}
          />
        </div>
        {selectedMembers.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
            <label
              htmlFor="group-members"
              className="block text-sm font-medium"
            >
              Members :
            </label>
            {selectedMembers?.map((member) => (
              <div
                key={member._id}
                className="flex items-center text-white text-sm gap-2 px-1.5 py-1 bg-purple-600 rounded-md"
              >
                <p>{member.username}</p>
                <span
                  className="cursor-pointer"
                  onClick={() => handleDelete(member)}
                >
                  <AiOutlineClose />
                </span>
              </div>
            ))}
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="flex flex-col gap-2 mt-4 max-h-52 overflow-y-auto scroll">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm hover:bg-green-300 cursor-pointer"
                onClick={() => handleAddMember(user)}
              >
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <p className="text-gray-700 font-medium">{user.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Backdrop>
  );
};

export default EditGroup;
