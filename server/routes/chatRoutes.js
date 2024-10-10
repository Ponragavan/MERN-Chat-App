const express = require("express");
const {
  accessChat,
  getAllChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  deleteChat,
} = require("../controllers/chatController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/chats")
  .post(authenticate, accessChat)
  .get(authenticate, getAllChats);
router.post("/group", authenticate, createGroupChat);
router.put("/rename", authenticate, renameGroup);
router.put("/groupadd", authenticate, addToGroup);
router.put("/groupremove", authenticate, removeFromGroup);
router.delete("/deletechat", authenticate, deleteChat);

module.exports = router;
