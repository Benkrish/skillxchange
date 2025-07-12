import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"

// Import routes
import profilesRoutes from "./routes/profiles.js"
import swapRequestsRoutes from "./routes/swap_requests.js"
import messagesRoutes from "./routes/messages.js"
import feedbackRoutes from "./routes/feedback.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "SkillXchange Backend API is running ✅",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      profiles: "/api/profiles",
      swapRequests: "/api/swap-requests",
      messages: "/api/messages",
      feedback: "/api/feedback",
    },
  })
})

// API routes
app.use("/api/profiles", profilesRoutes)
app.use("/api/swap-requests", swapRequestsRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/feedback", feedbackRoutes)

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)

  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      path: req.originalUrl,
      method: req.method,
    },
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SkillXchange Backend Server running on port ${PORT}`)
  console.log(`📍 API Base URL: http://localhost:${PORT}`)
  console.log(`🔗 Health Check: http://localhost:${PORT}/`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})

export default app
