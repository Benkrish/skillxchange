import express from "express"
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  getMessagesByUser,
  getConversation,
} from "../controllers/messagesController.js"

const router = express.Router()

// GET /api/messages - Get all messages
router.get("/", getAllMessages)

// GET /api/messages/user/:userId - Get messages by user
router.get("/user/:userId", getMessagesByUser)

// GET /api/messages/conversation/:userId1/:userId2 - Get conversation between users
router.get("/conversation/:userId1/:userId2", getConversation)

// GET /api/messages/:id - Get message by ID
router.get("/:id", getMessageById)

// POST /api/messages - Create new message
router.post("/", createMessage)

// PUT /api/messages/:id - Update message
router.put("/:id", updateMessage)

// DELETE /api/messages/:id - Delete message
router.delete("/:id", deleteMessage)

export default router
