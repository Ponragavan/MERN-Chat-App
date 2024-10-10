import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: null,
    chats: [],
  },
  reducers: {
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const { setChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;