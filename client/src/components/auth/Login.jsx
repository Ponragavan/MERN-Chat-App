import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This is important for handling cookies
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmail("");
        setPassword("");
        toast.success(data.message);
        navigate("/");
      } else {
        toast.warning(data.message || "Something went wrong");
      }

      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-4">
      <div className="hidden md:block md:col-span-3">
        <img src="/bg-auth.png" alt="Auth" className="min-h-screen" />
      </div>
      <div className="flex flex-col justify-center min-h-screen col-span-4 gap-3 text-center md:col-span-1 sm:gap-5">
        <img src="/logo.png" alt="Logo" className="w-20 mx-auto" />
        <h2 className="text-xl font-extrabold sm:text-3xl">ChitChat</h2>
        <h1 className="text-lg font-bold text-center text-indigo-500 sm:text-2xl">
          Login into your account
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-10/12 px-4 py-2 text-white transition duration-200 bg-indigo-500 rounded-lg hover:bg-indigo-600"
            disabled={loading}
          >
            {loading? <Spinner size="sm" layout="h-full" /> : 'Login'}
          </button>
          <p>
            Don't have an account?{" "}
            <Link to="/auth?login=false" className="text-indigo-600 underline">
              Create One
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
