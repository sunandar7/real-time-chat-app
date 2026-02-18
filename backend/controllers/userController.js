const User = require('../models/user');

const getLoginUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, data: user, message: 'User fetched successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select('-password');
        if (!users) {
            return res.status(404).json({
                success: false,
                message: 'No users found'
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Users fetched successfully', 
            data: users,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { getLoginUser, getAllUsers };