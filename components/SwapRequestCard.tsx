"use client"

import { Box, VStack, HStack, Text, Avatar, Badge, Button, ButtonGroup, useToast } from "@chakra-ui/react"
import { useState } from "react"
import type { SwapRequest } from "../lib/supabase"
import { supabase } from "../lib/supabase"

interface SwapRequestCardProps {
  request: SwapRequest
  currentUserId: string
  onUpdate: () => void
}

export default function SwapRequestCard({ request, currentUserId, onUpdate }: SwapRequestCardProps) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const isReceived = request.to_user === currentUserId
  const otherProfile = isReceived ? request.from_profile : request.to_profile

  const handleStatusUpdate = async (status: "accepted" | "rejected") => {
    setLoading(true)
    try {
      const { error } = await supabase.from("swap_requests").update({ status }).eq("id", request.id)

      if (error) throw error

      toast({
        title: `Request ${status}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      onUpdate()
    } catch (error) {
      toast({
        title: "Error updating request",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "accepted":
        return "green"
      case "rejected":
        return "red"
      default:
        return "gray"
    }
  }

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Avatar size="md" src={otherProfile?.profile_photo} name={otherProfile?.username} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold">{otherProfile?.username}</Text>
              <Text fontSize="sm" color="gray.500">
                {isReceived ? "Wants to swap with you" : "You requested"}
              </Text>
            </VStack>
          </HStack>
          <Badge colorScheme={getStatusColor(request.status)}>{request.status}</Badge>
        </HStack>

        <VStack spacing={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="green.600">
              Offering: <Badge colorScheme="green">{request.offered_skill}</Badge>
            </Text>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="sm" color="blue.600">
              Wanting: <Badge colorScheme="blue">{request.wanted_skill}</Badge>
            </Text>
          </HStack>
        </VStack>

        {request.message && (
          <Box bg="gray.50" p={3} rounded="md">
            <Text fontSize="sm" color="gray.700">
              "{request.message}"
            </Text>
          </Box>
        )}

        {isReceived && request.status === "pending" && (
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => handleStatusUpdate("accepted")} isLoading={loading} flex={1}>
              Accept
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => handleStatusUpdate("rejected")}
              isLoading={loading}
              flex={1}
            >
              Decline
            </Button>
          </ButtonGroup>
        )}

        <Text fontSize="xs" color="gray.400">
          {new Date(request.created_at).toLocaleDateString()}
        </Text>
      </VStack>
    </Box>
  )
}
