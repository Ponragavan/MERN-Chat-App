const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  var newMessage = {
    sender: req.user.id,
    content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "username profilePic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username email profilePic",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username profilePic")
      .populate("chat");
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
