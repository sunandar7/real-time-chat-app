import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        allChats: [],
        selectedChat: null
    },
    reducers: {
        setAllChats: (state, action) => { state.allChats = action.payload },
        setSelectedChat: (state, action) => { state.selectedChat = action.payload }
    }
});

export const { setAllChats, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;