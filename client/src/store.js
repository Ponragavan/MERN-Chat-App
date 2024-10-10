import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import searchReducer from "./slices/searchSlice";
import chatReducer from "./slices/chatSlice";
import fetchReducer from "./slices/fetchSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    chats: chatReducer,
    fetch: fetchReducer,
  },
});