import express from "express"
import {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByUser,
  getFeedbackForUser,
  getFeedbackBySwap,
} from "../controllers/feedbackController.js"

const router = express.Router()

// GET /api/feedback - Get all feedback
router.get("/", getAllFeedback)

// GET /api/feedback/given-by/:userId - Get feedback given by user
router.get("/given-by/:userId", getFeedbackByUser)

// GET /api/feedback/given-to/:userId - Get feedback received by user
router.get("/given-to/:userId", getFeedbackForUser)

// GET /api/feedback/swap/:swapId - Get feedback by swap ID
router.get("/swap/:swapId", getFeedbackBySwap)

// GET /api/feedback/:id - Get feedback by ID
router.get("/:id", getFeedbackById)

// POST /api/feedback - Create new feedback
router.post("/", createFeedback)

// PUT /api/feedback/:id - Update feedback
router.put("/:id", updateFeedback)

// DELETE /api/feedback/:id - Delete feedback
router.delete("/:id", deleteFeedback)

export default router
