const express = require('express');
const { authenticate } = require('../middlewares/authenticate');
const { sendMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

router.post('/', authenticate, sendMessage);
router.get('/:chatId', authenticate, getMessages);

module.exports = router;