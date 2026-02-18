import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";

const store = configureStore({
    reducer: {
        loaderReducer: loaderReducer,
        userReducer: userReducer,
        chatReducer: chatReducer
    }
});

export default store;

// 1907479064