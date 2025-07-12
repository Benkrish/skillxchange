"use client"

import { Box, VStack, HStack, Text, Avatar, Badge, Button, Wrap, WrapItem, useDisclosure } from "@chakra-ui/react"
import type { Profile } from "../lib/supabase"
import SwapRequestModal from "./SwapRequestModal"

interface ProfileCardProps {
  profile: Profile
  showSwapButton?: boolean
}

export default function ProfileCard({ profile, showSwapButton = false }: ProfileCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box
        bg="white"
        p={6}
        rounded="lg"
        shadow="md"
        _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        <VStack spacing={4} align="stretch">
          <HStack>
            <Avatar size="lg" src={profile.profile_photo} name={profile.username} />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="bold" fontSize="lg">
                {profile.username}
              </Text>
              {profile.location && (
                <Text color="gray.500" fontSize="sm">
                  📍 {profile.location}
                </Text>
              )}
            </VStack>
          </HStack>

          {profile.bio && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {profile.bio}
            </Text>
          )}

          {profile.skills_offered && profile.skills_offered.length > 0 && (
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color="green.600">
                Offers:
              </Text>
              <Wrap>
                {profile.skills_offered.slice(0, 3).map((skill, index) => (
                  <WrapItem key={index}>
                    <Badge colorScheme="green" variant="subtle">
                      {skill}
                    </Badge>
                  </WrapItem>
                ))}
                {profile.skills_offered.length > 3 && (
                  <WrapItem>
                    <Badge variant="outline">+{profile.skills_offered.length - 3} more</Badge>
                  </WrapItem>
                )}
              </Wrap>
            </VStack>
          )}

          {profile.skills_wanted && profile.skills_wanted.length > 0 && (
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color="blue.600">
                Wants:
              </Text>
              <Wrap>
                {profile.skills_wanted.slice(0, 3).map((skill, index) => (
                  <WrapItem key={index}>
                    <Badge colorScheme="blue" variant="subtle">
                      {skill}
                    </Badge>
                  </WrapItem>
                ))}
                {profile.skills_wanted.length > 3 && (
                  <WrapItem>
                    <Badge variant="outline">+{profile.skills_wanted.length - 3} more</Badge>
                  </WrapItem>
                )}
              </Wrap>
            </VStack>
          )}

          {showSwapButton && (
            <Button colorScheme="brand" onClick={onOpen} mt={2}>
              Request Skill Swap
            </Button>
          )}
        </VStack>
      </Box>

      <SwapRequestModal isOpen={isOpen} onClose={onClose} targetProfile={profile} />
    </>
  )
}
