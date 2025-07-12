"use client"

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Center,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { Session } from "@supabase/supabase-js"
import { supabase, type Profile } from "../lib/supabase"
import Navbar from "../components/Navbar"
import ProfileCard from "../components/ProfileCard"

interface HomeProps {
  session: Session | null
  loading: boolean
}

export default function Home({ session, loading }: HomeProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const router = useRouter()
  const bgColor = useColorModeValue("gray.50", "gray.900")

  useEffect(() => {
    fetchPublicProfiles()
  }, [])

  const fetchPublicProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(12)

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setProfilesLoading(false)
    }
  }

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar session={session} />

      <Container maxW="7xl" py={8}>
        {/* Hero Section */}
        <VStack spacing={8} textAlign="center" mb={12}>
          <Heading as="h1" size="2xl" bgGradient="linear(to-r, brand.400, brand.600)" bgClip="text">
            Welcome to SkillXchange
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            Connect with people in your community to exchange skills. Teach what you know, learn what you want!
          </Text>

          {!session && (
            <HStack spacing={4}>
              <Button colorScheme="brand" size="lg" onClick={() => router.push("/auth")}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/browse")}>
                Browse Skills
              </Button>
            </HStack>
          )}
        </VStack>

        {/* Featured Profiles */}
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg" textAlign="center">
            Featured Skill Swappers
          </Heading>

          {profilesLoading ? (
            <Center py={8}>
              <Spinner size="lg" color="brand.500" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
