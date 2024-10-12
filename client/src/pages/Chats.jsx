import { IoIosNotifications } from "react-icons/io";
import { CgSearch } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../slices/userSlice";
import Search from "../components/chats/Search";
import Profile from "../components/Profile/Profile";
import MyChats from "../components/chats/MyChats";
import ChatBox from "../components/chats/ChatBox";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import Notification from "../components/chats/Notification";
import NotificationBadge, { Effect } from "react-notification-badge";
import { toast } from "react-toastify";

const Chats = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const { notification } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok && data) {
          dispatch(login(data));
        } else if (response.status === 404) {
          toast.warning(data.message);
          navigate("/");
        } else {
          toast.warning(data.message);
          navigate("/");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    if (!user) {
      getUser();
    }
  }, [dispatch, navigate, user]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-10 flex justify-between h-auto p-3 pr-5 bg-indigo-900">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <h2 className="text-lg font-extrabold text-white uppercase sm:text-2xl">
            <span className="text-red-400">C</span>hit
            <span className="text-red-400">C</span>hat
          </h2>
        </div>
        <div className="flex items-center gap-5 sm:flex">
          <div onClick={() => setIsNotificationOpen(true)}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <IoIosNotifications
              size={30}
              className="text-white cursor-pointer"
            />
          </div>
          <CgSearch
            size={30}
            className="text-white sm:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          />
          <div
            className="bg-indigo-600 rounded-md hidden sm:flex items-center py-2 px-3 cursor-pointer"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <CgSearch size={26} className="text-gray-400" />
            <p className="px-2 text-white">Search Users</p>
          </div>
          <p className="hidden sm:block text-lg font-semibold text-white">
            {user && user.username}
          </p>
          <img
            src={user && user.profilePic}
            title={user && user.username}
            alt="profile"
            className="w-10 h-10 overflow-hidden rounded-full cursor-pointer border-2 border-white"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          />
        </div>
      </nav>
      {isSearchOpen && <Search onClose={() => setIsSearchOpen(false)} />}
      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
      {isNotificationOpen && (
        <Notification setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} onClose={() => setIsNotificationOpen(false)} />
      )}
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="grid grid-cols-4 gap-6 p-3 pt-20">
          {user && (
            <MyChats setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
          )}
          {user && (
            <ChatBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
          )}
        </div>
      )}
    </div>
  );
};

export default Chats;
