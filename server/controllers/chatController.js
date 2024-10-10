const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (req.user.id === userId) {
    return res
      .status(400)
      .json({ message: "Cannot create a chat with yourself" });
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    var isChat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "username email profilePic",
    });

    if (isChat) {
      return res.status(200).json(isChat);
    }

    const chatData = {
      chatName: "sender",
      users: [req.user.id, userId],
      isGroupChat: false,
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json(fullChat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 })
      .then(async (chats) => {
        chats = await User.populate(chats, {
          path: "latestMessage.sender",
          select: "username email profilePic",
        });
        return res.status(200).json(chats);
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createGroupChat = async (req, res) => {
  var { name, users, groupProfilePic } = req.body;

  try {
    if (!name || !users) {
      return res
        .status(400)
        .json({ message: "Group name and users are required" });
    }

    if (users.length < 2) {
      return res
        .status(400)
        .json({ message: "Group must have at least 2 users" });
    }

    users.push(req.user.id);

    const groupData = {
      chatName: name,
      users,
      isGroupChat: true,
      groupProfilePic,
      groupAdmin: req.user.id,
    };

    const createdGroup = await Chat.create(groupData);
    const fullGroup = await Chat.findById(createdGroup._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json(fullGroup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.renameGroup = async (req, res) => {
  const { chatId, name } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: name,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    return res.status(404).json({ message: "Group not found" });
  }
  return res.status(200).json(updatedChat);
};

exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    return res.status(404).json({ message: "Group not found" });
  }
  return res.status(200).json(added);
};

exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    return res.status(404).json({ message: "Group not found" });
  }
  return res.status(200).json(removed);
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.body;
  const deleted = await Chat.findByIdAndDelete(chatId);
  if (!deleted) {
    return res.status(404).json({ message: "Chat not found" });
  }
  return res.status(200).json({ message: deleted.isGroupChat ? "Group deleted" : "Chat deleted" });
};
