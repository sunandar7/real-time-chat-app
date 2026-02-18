const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUpUser = async (req, res) => {
    try {
        if (!req.body || !req.body.email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });

        // if user exists, return error response
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const profilePic = req.file ? req.file.path : null;
        req.body.profilePic = profilePic;

        // create new user
        const newUser = new User(req.body);
        await newUser.save();

        // return success response
        return res.status(201).json({ success: true, message: 'User created successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {
        // check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User does not exist' });
        }

        // check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // if the user exists and password is correct, assign a JWT token
        const token = jwt.sign(
            {userId: user._id},
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );
        return res.status(200).json({ 
            success: true,
            message: 'Login successful',
            token: token,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { signUpUser, login };