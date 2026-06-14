const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String, trim: true }, // Will hold text or file URLs
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    fileType: {
      type: String,
      enum: ["text", "image", "video", "document"],
      default: "text",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;