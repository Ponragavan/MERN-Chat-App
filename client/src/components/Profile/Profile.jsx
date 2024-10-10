import { FaUserEdit } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import React, { useState, useEffect } from "react";
import Backdrop from "../BackDrop";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/userSlice";
import EditProfile from "./EditProfile";

const Profile = ({ onClose }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditting, setIsEditting] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      setIsLoggingOut(true);
    }
  };

  useEffect(() => {
    if (isLoggingOut) {
      (async () => {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          dispatch(logout());
          navigate("/");
        } else {
          toast.error(data.message);
        }
        setIsLoggingOut(false);
      })();
    }
  }, [isLoggingOut, dispatch, navigate]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Backdrop classes="sm:right-10 max-w-xs" onClose={onClose}>
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="text-gray-700 text-sm italic font-medium">
            {user.email}
          </p>
          <img
            src={user.profilePic}
            alt={user.username}
            className="h-16 w-16 rounded-full object-cover border-2 border-gray-400"
          />
          <button
            className="flex items-center gap-3 min-w-48 bg-white p-3 rounded-full justify-center hover:bg-slate-100"
            onClick={() => setIsEditting(true)}
          >
            <FaUserEdit size={23} className="text-slate-600" />
            <p className="text-gray-700 font-medium">{user.username}</p>
          </button>
          <button
            className="flex items-center gap-3 min-w-48 bg-white p-3 rounded-full justify-center hover:bg-slate-100"
            onClick={handleLogout}
          >
            <ImExit size={23} className="text-red-600" />
            <p className="text-gray-700 font-medium">Logout</p>
          </button>
        </div>
      </Backdrop>
      {isEditting && <EditProfile onClose={() => setIsEditting(false)} />}
    </>
  );
};

export default Profile;
