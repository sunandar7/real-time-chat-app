const Message = require('../models/message');
const Chat = require('../models/chat');

const sendMessage = async (req, res) => {
    try {
        // store the message in messages collection
        const message = await Message.create(req.body);

        // update the latest message in chats collection
        const currentChat = await Chat.findByIdAndUpdate(
            req.body.chatId,
            { 
                lastMessage: message._id,
                $inc : { unreadMessagesCount: 1 } 

            },
            { new: true }
        );
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });

        if (!messages || messages.length === 0) {
            return res.status(404).json({ success: false, message: "No messages found" });
        }

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
}

module.exports = { sendMessage, getAllMessages };