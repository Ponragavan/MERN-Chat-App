import { createSlice } from "@reduxjs/toolkit";

const fetchSlice = createSlice({
    name: "fetch",
    initialState: {
        loading: false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = fetchSlice.actions;
export default fetchSlice.reducer;