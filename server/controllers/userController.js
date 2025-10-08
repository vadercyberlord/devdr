const User = require("../models/User");
const customErrors = require("../errors");
const { createTokenUser, attachCookies, checkPermissions } = require('../utils')

const getAllUsers = async(req, res) => {
    const users = await User.find({ role: "user" }).select("-password");
    if (!users) {
        throw new customErrors.NotFoundError("User does not exist");
    }
    res.status(200).json({ users });
};

const getSingleUser = async(req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
        throw new customErrors.NotFoundError(`No user with id:${req.params.id}`);
    }
    checkPermissions(req.user, user._id)
    res.status(200).json({ user });
};

const showCurrentUser = async(req, res) => {
    res.status(200).json({ user: req.user });
};

// Update user with user.save()
const updateUsers = async(req, res) => {
    const { email, name } = req.body;
    if (!name || !email) {
        throw new customErrors.BadRequestError("Please provide name and email");
    }
    const user = await User.findOne({ _id: req.user.userId })

    user.name = name;
    user.email = email;

    await user.save()

    const tokenUser = createTokenUser(user)
    attachCookies({ res, user: tokenUser })
    res.status(200).json({ user: tokenUser })
};

const updateUserPassword = async(req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new customErrors.BadRequestError("Please provide both password");
    }
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new customErrors.UnauthenticatedError("Invalid password");
    }

    user.password = newPassword;
    await user.save(); // invokes the pre save hook from user model -- new password is hashed
    res.status(200).json({});
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUsers,
    updateUserPassword,
};