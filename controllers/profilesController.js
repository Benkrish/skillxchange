import { supabase } from "../lib/supabase.js"

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, public_only = "true" } = req.query
    const offset = (page - 1) * limit

    let query = supabase.from("profiles").select("*", { count: "exact" })

    if (public_only === "true") {
      query = query.eq("is_public", true)
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

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Profile not found" },
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

// Create new profile
export const createProfile = async (req, res) => {
  try {
    const {
      username,
      skills_offered,
      skills_wanted,
      location,
      bio,
      availability,
      mobile,
      is_public = true,
      profile_photo,
    } = req.body

    // Basic validation
    if (!username || !skills_offered || !skills_wanted) {
      return res.status(400).json({
        success: false,
        error: { message: "Username, skills_offered, and skills_wanted are required" },
      })
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          username,
          skills_offered,
          skills_wanted,
          location,
          bio,
          availability,
          mobile,
          is_public,
          profile_photo,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      data,
      message: "Profile created successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove id from update data if present
    delete updateData.id
    delete updateData.created_at

    const { data, error } = await supabase.from("profiles").update(updateData).eq("id", id).select().single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          error: { message: "Profile not found" },
        })
      }
      throw error
    }

    res.json({
      success: true,
      data,
      message: "Profile updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from("profiles").delete().eq("id", id)

    if (error) throw error

    res.json({
      success: true,
      message: "Profile deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    })
  }
}

// Search profiles
export const searchProfiles = async (req, res) => {
  try {
    const { skill, location, limit = 10 } = req.query

    let query = supabase.from("profiles").select("*").eq("is_public", true)

    if (skill) {
      query = query.or(`skills_offered.cs.{${skill}},skills_wanted.cs.{${skill}}`)
    }

    if (location) {
      query = query.ilike("location", `%${location}%`)
    }

    const { data, error } = await query.limit(Number.parseInt(limit)).order("created_at", { ascending: false })

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
