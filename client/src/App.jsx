import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chats from "./pages/Chats";


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/chats",
      element: <Chats />
    }
  ]);
  return (
    <>
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
