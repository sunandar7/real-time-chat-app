import { axiosInstance } from "./index";

export const getAllChats = async() => {
    try {
        const response = await axiosInstance.get('/api/chat/get-all-chats');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createChat = async( members) => {
    try {
        const response = await axiosInstance.post('/api/chat/create-chat', { members });
        return response.data; 
    } catch (error) {
        throw error;
    }
}

export const clearUnreadMessage = async( chatId ) => {
    try {
        const response = await axiosInstance.post('/api/chat/clear-unread-message', { chatId });
        return response.data;
    } catch (error) {
        throw error;
    }
}