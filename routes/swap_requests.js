import express from "express"
import {
  getAllSwapRequests,
  getSwapRequestById,
  createSwapRequest,
  updateSwapRequest,
  deleteSwapRequest,
  getSwapRequestsByUser,
  updateSwapRequestStatus,
} from "../controllers/swapRequestsController.js"

const router = express.Router()

// GET /api/swap-requests - Get all swap requests
router.get("/", getAllSwapRequests)

// GET /api/swap-requests/user/:userId - Get swap requests by user
router.get("/user/:userId", getSwapRequestsByUser)

// GET /api/swap-requests/:id - Get swap request by ID
router.get("/:id", getSwapRequestById)

// POST /api/swap-requests - Create new swap request
router.post("/", createSwapRequest)

// PUT /api/swap-requests/:id - Update swap request
router.put("/:id", updateSwapRequest)

// PATCH /api/swap-requests/:id/status - Update swap request status
router.patch("/:id/status", updateSwapRequestStatus)

// DELETE /api/swap-requests/:id - Delete swap request
router.delete("/:id", deleteSwapRequest)

export default router
