"use client"

import type React from "react"

import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Switch,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Box,
  Heading,
  useToast,
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { type Profile, supabase } from "../lib/supabase"

interface ProfileFormProps {
  profile: Profile | null
  userId: string
  onSave: () => void
}

export default function ProfileForm({ profile, userId, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    location: "",
    bio: "",
    availability: "",
    mobile: "",
    is_public: true,
  })
  const [skillsOffered, setSkillsOffered] = useState<string[]>([])
  const [skillsWanted, setSkillsWanted] = useState<string[]>([])
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        location: profile.location || "",
        bio: profile.bio || "",
        availability: profile.availability || "",
        mobile: profile.mobile || "",
        is_public: profile.is_public,
      })
      setSkillsOffered(profile.skills_offered || [])
      setSkillsWanted(profile.skills_wanted || [])
    }
  }, [profile])

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()])
      setNewSkillOffered("")
    }
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()])
      setNewSkillWanted("")
    }
  }

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill))
  }

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const profileData = {
        ...formData,
        skills_offered: skillsOffered,
        skills_wanted: skillsWanted,
        id: userId,
      }

      const { error } = await supabase.from("profiles").upsert(profileData)

      if (error) throw error

      toast({
        title: "Profile saved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      onSave()
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="white" p={8} rounded="lg" shadow="md" w="full">
      <Heading as="h2" size="lg" mb={6}>
        {profile ? "Edit Profile" : "Create Profile"}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell others about yourself..."
            />
          </FormControl>

          <FormControl>
            <FormLabel>Skills You Offer</FormLabel>
            <HStack>
              <Input
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                placeholder="Add a skill you can teach"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillOffered())}
              />
              <Button onClick={addSkillOffered} colorScheme="green">
                Add
              </Button>
            </HStack>
            <Wrap mt={2}>
              {skillsOffered.map((skill, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="green">
                    <TagLabel>{skill}</TagLabel>
                    <TagCloseButton onClick={() => removeSkillOffered(skill)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <FormControl>
            <FormLabel>Skills You Want</FormLabel>
            <HStack>
              <Input
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                placeholder="Add a skill you want to learn"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkillWanted())}
              />
              <Button onClick={addSkillWanted} colorScheme="blue">
                Add
              </Button>
            </HStack>
            <Wrap mt={2}>
              {skillsWanted.map((skill, index) => (
                <WrapItem key={index}>
                  <Tag colorScheme="blue">
                    <TagLabel>{skill}</TagLabel>
                    <TagCloseButton onClick={() => removeSkillWanted(skill)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </FormControl>

          <FormControl>
            <FormLabel>Availability</FormLabel>
            <Input
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g., Weekends, Evenings"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Mobile</FormLabel>
            <Input
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="Your phone number"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="is-public" mb="0">
              Make profile public
            </FormLabel>
            <Switch
              id="is-public"
              isChecked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            />
          </FormControl>

          <Button type="submit" colorScheme="brand" size="lg" isLoading={loading}>
            Save Profile
          </Button>
        </VStack>
      </form>
    </Box>
  )
}
