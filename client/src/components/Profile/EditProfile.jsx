import React, { useState } from "react";
import Backdrop from "../BackDrop";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../slices/userSlice";
import Spinner from "../Spinner";

const EditProfile = ({ onClose }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: user.username,
    email: user.email,
    avatar: user.profilePic || "",
  });
  const avatars = [
    {
      value:
        "https://static.vecteezy.com/system/resources/previews/007/043/161/original/male-avatar-smiling-portrait-of-a-cheerful-young-man-with-a-happy-smile-vector.jpg",
    },
    { value: "https://cdn-icons-png.flaticon.com/512/5719/5719762.png" },
    {
      value:
        "https://th.bing.com/th/id/OIP.854KtflF4Tgso9MIXJnRkwHaHa?w=554&h=554&rs=1&pid=ImgDetMain",
    },
  ];

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password verified!");
        setIsVerified(true);
        setPassword("");
      } else {
        toast.error(data.message || "Invalid password. Please try again.");
      }
    } catch (error) {
      toast.error("Error verifying password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: data.name,
            email: data.email,
            profilePic: data.avatar,
          }),
        }
      );

      const resData = await response.json();

      if (response.ok) {
        toast.success(resData.message);
        dispatch(login(resData.user));
        setIsVerified(false);
        onClose();
      } else {
        toast.error(
          resData.message || "Error updating profile. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Backdrop classes="max-w-lg top-40" onClose={onClose}>
      <div className="flex flex-col gap-3 text-center sm:gap-5">
        <h1 className="text-lg font-bold text-center text-indigo-500 sm:text-2xl">
          {isVerified ? "Update" : "Verify"} Your Profile
        </h1>

        {!isVerified ? (
          <form className="space-y-6" onSubmit={handleVerifyPassword}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-10/12 px-3 py-2 text-gray-900 placeholder-gray-500 transition duration-200 bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your password"
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-10/12 px-4 py-2 text-white transition duration-200 bg-indigo-500 rounded-lg hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" layout="h-full" /> : "Verify"}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleProfileUpdate}>
            <input
              type="text"
              className="w-10/12 px-3 py-2 text-gray-900 placeholder-gray-500 transition duration-200 bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              autoFocus
            />
            <input
              type="text"
              className="w-10/12 px-3 py-2 text-gray-900 placeholder-gray-500 transition duration-200 bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Email address"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
            <div className="w-10/12 mx-auto text-left">
              <p className="text-gray-700">Choose an avatar:</p>
              <div className="flex justify-around">
                {avatars.map((option) => (
                  <img
                    key={option.value}
                    src={option.value}
                    alt="Avatar"
                    className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 ${
                      data.avatar === option.value
                        ? "border-indigo-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setData({ ...data, avatar: option.value })}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-10/12 px-4 py-2 text-white transition duration-200 bg-indigo-500 rounded-lg hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" layout="h-full" /> : 'Update Profile'}
            </button>
          </form>
        )}
        <button
          className="w-1/3 px-4 py-2 mx-auto text-white transition duration-200 bg-slate-500 rounded-lg hover:bg-slate-600"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Backdrop>
  );
};

export default EditProfile;
