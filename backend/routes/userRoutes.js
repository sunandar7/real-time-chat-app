const router = require('express').Router();
const { getLoginUser } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/get-login-user', authenticate, getLoginUser);
router.get('/get-all-users', authenticate, getAllUsers);

module.exports = router;