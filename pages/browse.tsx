"use client"

import type React from "react"

import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Center,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase, type Profile } from "../lib/supabase"
import Navbar from "../components/Navbar"
import ProfileCard from "../components/ProfileCard"

interface BrowseProps {
  session: Session | null
  loading: boolean
}

export default function Browse({ session, loading }: BrowseProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [profilesLoading, setProfilesLoading] = useState(true)
  const bgColor = useColorModeValue("gray.50", "gray.900")

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async (search?: string) => {
    setProfilesLoading(true)
    try {
      let query = supabase.from("profiles").select("*").eq("is_public", true).order("created_at", { ascending: false })

      if (search) {
        query = query.or(`username.ilike.%${search}%,location.ilike.%${search}%,bio.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error("Error fetching profiles:", error)
    } finally {
      setProfilesLoading(false)
    }
  }

  const handleSearch = () => {
    fetchProfiles(searchTerm)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar session={session} />

      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">
            Browse Skill Swappers
          </Heading>

          {/* Search */}
          <HStack maxW="md" mx="auto">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search by name, location, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                bg="white"
              />
            </InputGroup>
            <Button colorScheme="brand" onClick={handleSearch}>
              Search
            </Button>
          </HStack>

          {/* Profiles Grid */}
          {profilesLoading ? (
            <Center py={8}>
              <Spinner size="lg" color="brand.500" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} showSwapButton={!!session} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  )
}
