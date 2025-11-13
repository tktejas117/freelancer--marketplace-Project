// server/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true // For efficient queries
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  senderUsername: {
    type: String,
    required: true
  },
  messageText: {
    type: String,
    required: true,
    maxlength: 1000 // Limit message length
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for efficient querying by room and timestamp
messageSchema.index({ roomId: 1, timestamp: 1 });

module.exports = mongoose.model('Message', messageSchema);