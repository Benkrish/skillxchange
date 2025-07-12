"use client"

import { Box, Container, VStack, useColorModeValue, Spinner, Center } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { Session } from "@supabase/supabase-js"
import { supabase, type Profile } from "../lib/supabase"
import Navbar from "../components/Navbar"
import ProfileForm from "../components/ProfileForm"

interface ProfilePageProps {
  session: Session | null
  loading: boolean
}

export default function ProfilePage({ session, loading }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const router = useRouter()
  const bgColor = useColorModeValue("gray.50", "gray.900")

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth")
    } else if (session) {
      fetchProfile()
    }
  }, [session, loading, router])

  const fetchProfile = async () => {
    if (!session?.user) return

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar session={session} />

      <Container maxW="4xl" py={8}>
        <VStack spacing={8}>
          <ProfileForm profile={profile} userId={session.user.id} onSave={fetchProfile} />
        </VStack>
      </Container>
    </Box>
  )
}
