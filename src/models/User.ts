// src/models/User.ts
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    // Changed from 'timestamp' to 'createdAt' for consistency
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: [MessageSchema],
  createdAt: {
    // Added createdAt field to ChatSchema
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  chats: [ChatSchema],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
