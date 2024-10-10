import { CgProfile } from "react-icons/cg";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    async function getUser() {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        navigate("/chats");
      }
    }
    getUser();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex justify-between h-auto p-3 pr-5 bg-indigo-900">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10" />
          <h2 className="text-lg font-extrabold text-white uppercase sm:text-2xl">
            <span className="text-red-400">C</span>hit
            <span className="text-red-400">C</span>hat
          </h2>
        </div>
        <div className="items-center hidden gap-5 sm:flex">
          <Link
            to="/auth?login=true"
            className="px-4 py-1.5 text-center bg-white rounded-md text-indigo-700"
          >
            Login
          </Link>
          <Link
            to="/auth?login=false"
            className="px-4 py-1.5 bg-transparent rounded-md border-2 border-white text-white transition-all outline-none hover:bg-indigo-600"
          >
            Sign Up
          </Link>
        </div>
        <Link to="/auth?login=true" className="block text-white sm:hidden">
          <CgProfile size={35} />
        </Link>
      </nav>
      <div className="flex flex-col items-center pt-10 sm:pt-16 gap-5 sm:gap-10 min-h-[calc(100vh-4rem)] text-center">
        <h1 className="text-4xl font-bold text-indigo-500 sm:text-6xl">
          Access All People in the World!!
        </h1>
        <p className="text-lg text-indigo-900 sm:text-2xl">
          The best chat app in the world
        </p>
        <div className="flex flex-col items-center justify-center max-w-screen-md gap-6 sm:flex-row">
          <img
            src="/man.png"
            alt="Man"
            className="rounded-tl-[35%] rounded-br-[35%] w-60 h-60 sm:w-80 sm:h-80 object-cover"
          />
          <Link
            to="/auth?login=false"
            className="flex items-center justify-center w-48 h-12 text-lg font-bold text-white bg-indigo-900 rounded-lg sm:hidden"
          >
            Get Started <span className="ml-3">&mdash;&gt;</span>
          </Link>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              Advanced Communication Platform
            </h2>
            <p className="mt-2 text-gray-600 sm:text-lg">
              This app offers seamless real-time communication, whether you're
              managing projects, collaborating with teams, or staying connected
              with friends. It features instant messaging, notifications, and a
              user-friendly interface designed to boost productivity.
            </p>
            <p className="mt-4 text-gray-600 sm:text-lg">
              You can easily switch between single chats for private
              conversations or create group chats to collaborate with multiple
              users at once. The platform also supports media sharing, real-time
              status updates, and typing indicators to keep everyone engaged and
              informed.
            </p>
          </div>
        </div>
        <Link
          to="/auth?login=false"
          className="items-center justify-center hidden h-16 mb-5 text-xl font-bold text-white transition-all bg-indigo-900 rounded-lg sm:flex w-60 sm:mb-0 hover:bg-indigo-600"
        >
          Get Started <span className="ml-3">&mdash;&gt;</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
