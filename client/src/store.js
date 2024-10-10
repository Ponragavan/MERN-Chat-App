import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"
import searchReducer from "./slices/searchSlice";
import chatReducer from "./slices/chatSlice";
import notificationReducer from "./slices/notificationSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    chats: chatReducer,
    notification: notificationReducer,
  },
});