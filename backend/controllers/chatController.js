const Chat = require('../models/chat');

const createChat = async (req, res) => {
    try {
        const chat = await Chat.create(req.body);
        return res.status(201).json({ success: true, message: "Chat created successfully", data: chat });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({ members : { $in: req.userId } })
                                .populate("members", "-password")
                                .populate("lastMessage")
                                .sort({ updatedAt: -1 });

        if (!chats || chats.length === 0) {
            return res.status(404).json({ success: false, message: "No chats found" });
        }

        return res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            data: chats
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = { createChat, getAllChats };