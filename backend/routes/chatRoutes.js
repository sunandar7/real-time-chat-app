const router = require('express').Router();
const { createChat, getAllChats, clearUnreadMessage } = require('../controllers/chatController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/create-chat', authenticate, createChat);
router.get('/get-all-chats', authenticate, getAllChats);
router.post('/clear-unread-message', authenticate, clearUnreadMessage);

module.exports = router;