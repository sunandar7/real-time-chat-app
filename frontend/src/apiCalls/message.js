import { axiosInstance } from "./index";

export const createMessage = async (message) => {
    try {
        const response = await axiosInstance.post('/api/message/send-message', message);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMessagesByChatId = async (chatId) => {
    try {
        const response = await axiosInstance.get(`/api/message/get-all-messages/${chatId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}