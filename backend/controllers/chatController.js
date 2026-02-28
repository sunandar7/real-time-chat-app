const Chat = require('../models/chat');
const Message = require('../models/message');

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

const clearUnreadMessage = async (req, res) => {
    try {
        const { chatId } = req.body;

        // Update the unread message count in chat collection
        const chat = await Chat.findById(chatId);
        if(!chat) {
            return res.status(404).json({ success: false, message: "Chat not found with the given chat ID" });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $set: { unreadMessagesCount: 0 } },
            { new: true }
        ).populate("members", "-password")
        .populate("lastMessage");

        // Update the 'read' status to true in message collection
        await Message.updateMany(
            { chatId: chatId, read: false},
            { $set: { read: true } }
        );
        return res.status(200).json({ success: true, message: "Unread message count cleared successfully", data: updatedChat });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = { createChat, getAllChats, clearUnreadMessage };