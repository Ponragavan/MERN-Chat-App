const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const { setCookie } = require("../utils/setCookie");

exports.register = async (req, res) => {
  try {
    const { username, email, password, profilePic } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
    });
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    setCookie(res, token);
    return res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const id = req.user.id;
    const keyword = req.query.search
      ? {
          username: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};
      
    const users = await User.find({ ...keyword, _id: { $ne: id } }).select(
      "-password"
    );
    return res.status(200).json({
      message: users.length > 0 ? "Users retrived" : "User not found",
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    return res.status(200).json({ message: "Password verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email, profilePic } = req.body;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    await user.save();
    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
