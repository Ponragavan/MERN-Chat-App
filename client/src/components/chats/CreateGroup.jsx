import React, { useEffect, useState } from "react";
import Backdrop from "../BackDrop";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKeyword } from "../../slices/searchSlice";
import { toast } from "react-toastify";
import { setChat, setChats } from "../../slices/chatSlice";

const CreateGroup = ({ onClose,setFetchAgain,fetchAgain }) => {
  const [groupName, setGroupName] = useState("");
  const [avatar, setAvatar] = useState();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const keyword = useSelector((state) => state.search.keyword);
  const { chats } = useSelector((state) => state.chats);

  const dispatch = useDispatch();

  const groupPics = [
    {
      value:
        "https://img.freepik.com/premium-vector/people-group-avatar-character-vector-illustration-design_24877-18925.jpg",
    },
    {
      value:
        "https://newtohr.com/wp-content/uploads/2015/12/New-To-HR-Team.png",
    },
    {
      value:
        "https://th.bing.com/th/id/OIP.kqLyRWmiyf-xTHr4qjyQiwHaGS?w=740&h=629&rs=1&pid=ImgDetMain",
    },
  ];

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

  const handleAddMember = (user) => {
    if (selectedMembers.some((member) => member._id === user._id)) {
      toast.error("User already added to the group");
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleDelete = (deletedUser) => {
    setSelectedMembers(
      selectedMembers.filter((user) => user._id !== deletedUser._id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName) {
      toast.error("Group name is required");
      return;
    }
    if (selectedMembers.length < 2) {
      toast.error("Add at least two members to the group");
      return;
    }
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/chat/group`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: groupName,
          users: selectedMembers.map((m) => m._id),
          groupProfilePic: avatar,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      dispatch(setChats([data, ...chats]));
      dispatch(setChat(data));
      dispatch(setSearchKeyword(""));
      setFetchAgain(!fetchAgain);
      toast.success("Group created successfully");
      onClose();
    } else {
      toast.error(data.message || "Cannot create group. Please try again.");
    }
  };

  return (
    <Backdrop
      classes="relative max-w-lg top-5 overflow-y-hidden"
      onClose={onClose}
    >
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create Group</h2>
        <button onClick={onClose}>
          <AiOutlineClose size={25} />
        </button>
      </header>
      <form className="mt-4 space-y-4 mb-3">
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium">
            Group Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm outline-none focus:border-2 focus:border-cyan-500"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Choose Profile Picture
          </label>
          <div className="flex justify-around">
            {groupPics.map((option) => (
              <div
                key={option.value}
                className={`w-12 h-12 sm:h-16 sm:w-16 rounded-full overflow-hidden cursor-pointer border-2 ${
                  avatar === option.value
                    ? "border-indigo-500"
                    : "border-transparent"
                }`}
                onClick={() => setAvatar(option.value)}
              >
                <img
                  src={option.value}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="group-members" className="block text-sm font-medium">
            Add Members
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm outline-none focus:border-2 focus:border-cyan-500"
            onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
          />
        </div>
        {selectedMembers.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
      </form>
        <div className="flex rounded-b-lg justify-end">
          <button
          onClick={handleSubmit}
            className="z-10 px-3 bg-cyan-500 text-white font-semibold py-2 rounded-md hover:bg-cyan-600 transition duration-200"
          >
            Create Group
          </button>
        </div>
    </Backdrop>
  );
};

export default CreateGroup;
