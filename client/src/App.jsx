import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "./components/Spinner";

const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Chats = lazy(() => import("./pages/Chats"));

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
      element: <Chats />,
    }
  ]);

  return (
    <>
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
      <Suspense fallback={<Spinner size='lg' />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
};

export default App;
