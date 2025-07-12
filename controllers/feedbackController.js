import { supabase } from "../lib/supabase.js"

// Get all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from("feedback")
      .select(
        `
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    res.json({
      success: true,
      data,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Feedback not found" },
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Get feedback given by user
export const getFeedbackByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `)
      .eq("given_by", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Get feedback received by user
export const getFeedbackForUser = async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `)
      .eq("given_to", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Calculate average rating
    const averageRating = data.length > 0 ? data.reduce((sum, feedback) => sum + feedback.rating, 0) / data.length : 0

    res.json({
      success: true,
      data,
      count: data.length,
      averageRating: Math.round(averageRating * 10) / 10,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Get feedback by swap ID
export const getFeedbackBySwap = async (req, res) => {
  try {
    const { swapId } = req.params

    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `)
      .eq("swap_id", swapId)
      .order("created_at", { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Create new feedback
export const createFeedback = async (req, res) => {
  try {
    const { swap_id, given_by, given_to, rating, comment } = req.body

    // Basic validation
    if (!swap_id || !given_by || !given_to || !rating) {
      return res.status(400).json({
        success: false,
        error: { message: "swap_id, given_by, given_to, and rating are required" },
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: { message: "Rating must be between 1 and 5" },
      })
    }

    if (given_by === given_to) {
      return res.status(400).json({
        success: false,
        error: { message: "Cannot give feedback to yourself" },
      })
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert([
        {
          swap_id,
          given_by,
          given_to,
          rating,
          comment,
        },
      ])
      .select(`
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `)
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: "Feedback created successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Update feedback
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove protected fields
    delete updateData.id
    delete updateData.created_at
    delete updateData.swap_id
    delete updateData.given_by
    delete updateData.given_to

    // Validate rating if provided
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return res.status(400).json({
        success: false,
        error: { message: "Rating must be between 1 and 5" },
      })
    }

    const { data, error } = await supabase
      .from("feedback")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        giver:profiles!feedback_given_by_fkey(id, username, profile_photo),
        receiver:profiles!feedback_given_to_fkey(id, username, profile_photo),
        swap_request:swap_requests(id, offered_skills, wanted_skills, status)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Feedback not found" },
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: "Feedback updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from("feedback").delete().eq("id", id)

    if (error) throw error

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}
