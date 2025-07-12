import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("is_public", true)
          .order("created_at", { ascending: false })

        if (error) throw error

        res.status(200).json({ data })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
      break

    case "POST":
      try {
        const { data, error } = await supabase.from("profiles").insert([req.body]).select()

        if (error) throw error

        res.status(201).json({ data })
      } catch (error: any) {
        res.status(500).json({ error: error.message })
      }
      break

    default:
      res.setHeader("Allow", ["GET", "POST"])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
