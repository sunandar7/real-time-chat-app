const router = require('express').Router();
const { createChat, getAllChats } = require('../controllers/chatController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/create-chat', authenticate, createChat);
router.get('/get-all-chats', authenticate, getAllChats);

module.exports = router;