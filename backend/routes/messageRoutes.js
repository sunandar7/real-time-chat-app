const router = require('express').Router();
const { sendMessage, getAllMessages } = require('../controllers/messageController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/send-message', authenticate, sendMessage);
router.get('/get-all-messages/:chatId', authenticate, getAllMessages);

module.exports = router;