import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for cross-origin requests
          body: JSON.stringify({
            username: name,
            email,
            password,
            profilePic: avatar,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successfully completed.");
        setName("");
        setEmail("");
        setPassword("");
        setAvatar("");
        navigate("/auth?login=true");
      } else {
        toast.warning(
          data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-4">
      <div className="flex flex-col justify-center min-h-screen col-span-4 gap-3 text-center md:col-span-1 sm:gap-5">
        <img src="/logo.png" alt="Logo" className="w-20 mx-auto" />
        <h2 className="text-xl font-extrabold sm:text-3xl">ChitChat</h2>
        <h1 className="text-lg font-bold text-center text-indigo-500 sm:text-2xl">
          Create an Account
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            className="w-10/12 px-3 py-2 capitalize text-gray-900 placeholder-gray-500 transition duration-200 bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            value={email}
            className="w-10/12 px-3 py-2 text-gray-900 placeholder-gray-500 transition duration-200 bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            value={password}
            className="w-10/12 px-3 py-2 text-gray-900 placeholder-gray-500 transition duration-200 bg-gray-100 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="w-10/12 mx-auto text-left">
            <p className="text-gray-700">Choose an avatar:</p>
            <div className="flex justify-around">
              {avatars.map((option) => (
                <div
                  key={option.value}
                  className={`w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 ${
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

          <button
            type="submit"
            className="w-10/12 px-4 py-2 text-white transition duration-200 bg-indigo-500 rounded-lg hover:bg-indigo-600"
            disabled={loading}
          >
            {loading? <Spinner size="sm" layout="h-full" /> : 'SignUp'}
          </button>
          <p>
            Already have an account?{" "}
            <Link to="/auth?login=true" className="text-indigo-600 underline">
              Login Here
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block md:col-span-3">
        <img src="/bg-signup.png" alt="Auth" className="min-h-screen" />
      </div>
    </div>
  );
};

export default SignUp;
