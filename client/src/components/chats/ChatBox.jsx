import React from "react";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { chat } = useSelector((state) => state.chats);
  return (
    <div className={`${!chat ? "hidden sm:grid" : "col-span-4"} sm:col-span-3 bg-slate-200 h-[87vh] p-2 sm:p-3 rounded-lg shadow-lg`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
