import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  location?: string
  profile_photo?: string
  skills_offered: string[]
  skills_wanted: string[]
  availability?: string
  mobile?: string
  bio?: string
  is_public: boolean
  created_at: string
}

export type SwapRequest = {
  id: string
  from_user: string
  to_user: string
  offered_skill: string
  wanted_skill: string
  message?: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
  from_profile?: Profile
  to_profile?: Profile
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  swap_id?: string
  content: string
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export type Feedback = {
  id: string
  swap_id: string
  given_by: string
  given_to: string
  rating: number
  comment?: string
  created_at: string
  giver?: Profile
  receiver?: Profile
}
