"use client"

import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  SimpleGrid,
  Text,
  useColorModeValue,
  Spinner,
  Center,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import type { Session } from "@supabase/supabase-js"
import { supabase, type SwapRequest, type Profile } from "../lib/supabase"
import Navbar from "../components/Navbar"
import SwapRequestCard from "../components/SwapRequestCard"

interface DashboardProps {
  session: Session | null
  loading: boolean
}

export default function Dashboard({ session, loading }: DashboardProps) {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [requestsLoading, setRequestsLoading] = useState(true)
  const router = useRouter()
  const bgColor = useColorModeValue("gray.50", "gray.900")

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth")
    } else if (session) {
      fetchUserData()
    }
  }, [session, loading, router])

  const fetchUserData = async () => {
    if (!session?.user) return

    try {
      // Fetch user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      setProfile(profileData)

      // Fetch swap requests
      const { data: requestsData, error } = await supabase
        .from("swap_requests")
        .select(`
          *,
          from_profile:profiles!swap_requests_from_user_fkey(*),
          to_profile:profiles!swap_requests_to_user_fkey(*)
        `)
        .or(`from_user.eq.${session.user.id},to_user.eq.${session.user.id}`)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSwapRequests(requestsData || [])
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setRequestsLoading(false)
    }
  }

  if (loading || !session) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  const pendingRequests = swapRequests.filter((req) => req.status === "pending")
  const acceptedRequests = swapRequests.filter((req) => req.status === "accepted")

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar session={session} />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading as="h1" size="xl">
              Welcome back, {profile?.username || "User"}!
            </Heading>
            <Button colorScheme="brand" onClick={() => router.push("/profile")}>
              Edit Profile
            </Button>
          </HStack>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box bg="white" p={6} rounded="lg" shadow="sm">
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  {pendingRequests.length}
                </Text>
                <Text color="gray.600">Pending Requests</Text>
              </VStack>
            </Box>
            <Box bg="white" p={6} rounded="lg" shadow="sm">
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {acceptedRequests.length}
                </Text>
                <Text color="gray.600">Active Swaps</Text>
              </VStack>
            </Box>
            <Box bg="white" p={6} rounded="lg" shadow="sm">
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {profile?.skills_offered?.length || 0}
                </Text>
                <Text color="gray.600">Skills Offered</Text>
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Recent Swap Requests */}
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading as="h2" size="lg">
                Recent Swap Requests
              </Heading>
              <Button variant="outline" onClick={() => router.push("/browse")}>
                Browse More
              </Button>
            </HStack>

            {requestsLoading ? (
              <Center py={8}>
                <Spinner size="lg" color="brand.500" />
              </Center>
            ) : swapRequests.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No swap requests yet.</Text>
                <Button mt={4} colorScheme="brand" onClick={() => router.push("/browse")}>
                  Start Swapping Skills
                </Button>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {swapRequests.slice(0, 6).map((request) => (
                  <SwapRequestCard
                    key={request.id}
                    request={request}
                    currentUserId={session.user.id}
                    onUpdate={fetchUserData}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}
