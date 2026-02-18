const router = require('express').Router();
const { signUpUser, login } = require('../controllers/authController');
const upload = require('../middlewares/upload');

router.post('/signup', upload.single('profilePic'), signUpUser);
router.post('/login', login);

module.exports = router;