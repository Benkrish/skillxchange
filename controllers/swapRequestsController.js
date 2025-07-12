import { supabase } from "../lib/supabase.js"

// Get all swap requests
export const getAllSwapRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const offset = (page - 1) * limit

    let query = supabase.from("swap_requests").select(
      `
        *,
        from_profile:profiles!swap_requests_from_user_fkey(id, username, profile_photo),
        to_profile:profiles!swap_requests_to_user_fkey(id, username, profile_photo)
      `,
      { count: "exact" },
    )

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query
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

// Get swap request by ID
export const getSwapRequestById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from("swap_requests")
      .select(`
        *,
        from_profile:profiles!swap_requests_from_user_fkey(id, username, profile_photo),
        to_profile:profiles!swap_requests_to_user_fkey(id, username, profile_photo)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Swap request not found" },
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

// Get swap requests by user
export const getSwapRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { type = "all", status } = req.query

    let query = supabase.from("swap_requests").select(`
        *,
        from_profile:profiles!swap_requests_from_user_fkey(id, username, profile_photo),
        to_profile:profiles!swap_requests_to_user_fkey(id, username, profile_photo)
      `)

    if (type === "sent") {
      query = query.eq("from_user", userId)
    } else if (type === "received") {
      query = query.eq("to_user", userId)
    } else {
      query = query.or(`from_user.eq.${userId},to_user.eq.${userId}`)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

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

// Create new swap request
export const createSwapRequest = async (req, res) => {
  try {
    const { from_user, to_user, offered_skills, wanted_skills, message } = req.body

    // Basic validation
    if (!from_user || !to_user || !offered_skills || !wanted_skills) {
      return res.status(400).json({
        success: false,
        error: { message: "from_user, to_user, offered_skills, and wanted_skills are required" },
      })
    }

    if (from_user === to_user) {
      return res.status(400).json({
        success: false,
        error: { message: "Cannot create swap request with yourself" },
      })
    }

    const { data, error } = await supabase
      .from("swap_requests")
      .insert([
        {
          from_user,
          to_user,
          offered_skills,
          wanted_skills,
          message,
          status: "pending",
        },
      ])
      .select(`
        *,
        from_profile:profiles!swap_requests_from_user_fkey(id, username, profile_photo),
        to_profile:profiles!swap_requests_to_user_fkey(id, username, profile_photo)
      `)
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: "Swap request created successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Update swap request
export const updateSwapRequest = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove protected fields
    delete updateData.id
    delete updateData.created_at
    delete updateData.from_user
    delete updateData.to_user

    const { data, error } = await supabase
      .from("swap_requests")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        from_profile:profiles!swap_requests_from_user_fkey(id, username, profile_photo),
        to_profile:profiles!swap_requests_to_user_fkey(id, username, profile_photo)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Swap request not found" },
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: "Swap request updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Update swap request status
export const updateSwapRequestStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ["pending", "accepted", "rejected", "completed"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
      })
    }

    const { data, error } = await supabase
      .from("swap_requests")
      .update({ status })
      .eq("id", id)
      .select(`
        *,
        from_profile:profiles!swap_requests_from_user_fkey(id, username, profile_photo),
        to_profile:profiles!swap_requests_to_user_fkey(id, username, profile_photo)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Swap request not found" },
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: `Swap request ${status} successfully`,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Delete swap request
export const deleteSwapRequest = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from("swap_requests").delete().eq("id", id)

    if (error) throw error

    res.json({
      success: true,
      message: "Swap request deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}
