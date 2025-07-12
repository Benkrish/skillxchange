"use client"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { type Profile, supabase } from "../lib/supabase"

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  targetProfile: Profile
}

export default function SwapRequestModal({ isOpen, onClose, targetProfile }: SwapRequestModalProps) {
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const [offeredSkill, setOfferedSkill] = useState("")
  const [wantedSkill, setWantedSkill] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen])

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const handleSubmit = async () => {
    if (!userProfile || !offeredSkill || !wantedSkill) {
      toast({
        title: "Please fill in all required fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("swap_requests").insert([
        {
          from_user: userProfile.id,
          to_user: targetProfile.id,
          offered_skill: offeredSkill,
          wanted_skill: wantedSkill,
          message,
          status: "pending",
        },
      ])

      if (error) throw error

      toast({
        title: "Swap request sent!",
        description: "You will be notified when they respond.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      onClose()
      setOfferedSkill("")
      setWantedSkill("")
      setMessage("")
    } catch (error) {
      toast({
        title: "Error sending request",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Request Skill Swap with {targetProfile.username}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>What skill will you offer?</FormLabel>
              <Select
                placeholder="Select a skill you offer"
                value={offeredSkill}
                onChange={(e) => setOfferedSkill(e.target.value)}
              >
                {userProfile?.skills_offered?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>What skill do you want from them?</FormLabel>
              <Select
                placeholder="Select a skill they offer"
                value={wantedSkill}
                onChange={(e) => setWantedSkill(e.target.value)}
              >
                {targetProfile.skills_offered?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Message (optional)</FormLabel>
              <Textarea
                placeholder="Tell them why you'd like to swap skills..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
            Send Request
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
