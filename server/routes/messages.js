const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const verifyToken = require('../middleware/verifyToken');

// GET chat history for a specific room
router.get('/:chatRoomId', verifyToken, async (req, res) => {
  console.log('--- Inside messages.js GET /:chatRoomId route handler ---');
  console.log('Authenticated user:', req.user);
  console.log('Request params:', req.params);

  try {
    const chatRoomId = req.params.chatRoomId;

    // IMPORTANT: Use "roomId" here to match your Message model's field
    const messages = await Message.find({ roomId: chatRoomId })
      .sort({ timestamp: 1 }) // oldest first
      .limit(100);

    console.log(`Found ${messages.length} messages for chat room ${chatRoomId}.`);
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Server error during fetching messages:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
