import { supabase } from "../lib/supabase.js"

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(id, username, profile_photo),
        receiver:profiles!messages_receiver_id_fkey(id, username, profile_photo)
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

// Get message by ID
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from("messages")
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, profile_photo),
        receiver:profiles!messages_receiver_id_fkey(id, username, profile_photo)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Message not found" },
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

// Get messages by user
export const getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { type = "all", limit = 50 } = req.query

    let query = supabase.from("messages").select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, profile_photo),
        receiver:profiles!messages_receiver_id_fkey(id, username, profile_photo)
      `)

    if (type === "sent") {
      query = query.eq("sender_id", userId)
    } else if (type === "received") {
      query = query.eq("receiver_id", userId)
    } else {
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(Number.parseInt(limit))

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

// Get conversation between two users
export const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params
    const { limit = 50, page = 1 } = req.query
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(id, username, profile_photo),
        receiver:profiles!messages_receiver_id_fkey(id, username, profile_photo)
      `,
        { count: "exact" },
      )
      .or(
        `and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`,
      )
      .order("created_at", { ascending: true })
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

// Create new message
export const createMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, skill, message } = req.body

    // Basic validation
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({
        success: false,
        error: { message: "sender_id, receiver_id, and message are required" },
      })
    }

    if (sender_id === receiver_id) {
      return res.status(400).json({
        success: false,
        error: { message: "Cannot send message to yourself" },
      })
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          sender_id,
          receiver_id,
          skill,
          message,
        },
      ])
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, profile_photo),
        receiver:profiles!messages_receiver_id_fkey(id, username, profile_photo)
      `)
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: "Message sent successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Update message
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove protected fields
    delete updateData.id
    delete updateData.created_at
    delete updateData.sender_id
    delete updateData.receiver_id

    const { data, error } = await supabase
      .from("messages")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, profile_photo),
        receiver:profiles!messages_receiver_id_fkey(id, username, profile_photo)
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Message not found" },
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: "Message updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from("messages").delete().eq("id", id)

    if (error) throw error

    res.json({
      success: true,
      message: "Message deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}
