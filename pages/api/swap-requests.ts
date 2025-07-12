import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case "GET":
      try {
        const { userId } = req.query

        let query = supabase.from("swap_requests").select(`
            *,
            from_profile:profiles!swap_requests_from_user_fkey(*),
            to_profile:profiles!swap_requests_to_user_fkey(*)
          `)

        if (userId) {
          query = query.or(`from_user.eq.${userId},to_user.eq.${userId}`)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error

        res.status(200).json({ data })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
      break

    case "POST":
      try {
        const { data, error } = await supabase.from("swap_requests").insert([req.body]).select()

        if (error) throw error

        res.status(201).json({ data })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
      break

    case "PUT":
      try {
        const { id, ...updateData } = req.body

        const { data, error } = await supabase.from("swap_requests").update(updateData).eq("id", id).select()

        if (error) throw error

        res.status(200).json({ data })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
