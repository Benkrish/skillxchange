import express from "express"
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  searchProfiles,
} from "../controllers/profilesController.js"

const router = express.Router()

// GET /api/profiles - Get all profiles
router.get("/", getAllProfiles)

// GET /api/profiles/search - Search profiles
router.get("/search", searchProfiles)

// GET /api/profiles/:id - Get profile by ID
router.get("/:id", getProfileById)

// POST /api/profiles - Create new profile
router.post("/", createProfile)

// PUT /api/profiles/:id - Update profile
router.put("/:id", updateProfile)

// DELETE /api/profiles/:id - Delete profile
router.delete("/:id", deleteProfile)

export default router
