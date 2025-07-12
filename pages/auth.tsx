"use client"

import {
  Box,
  Container,
  Heading,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react"
import { useEffect } from "react"
import { useRouter } from "next/router"
import type { Session } from "@supabase/supabase-js"
import LoginForm from "../components/LoginForm"
import SignUpForm from "../components/SignUpForm"

interface AuthProps {
  session: Session | null
  loading: boolean
}

export default function Auth({ session, loading }: AuthProps) {
  const router = useRouter()
  const bgColor = useColorModeValue("gray.50", "gray.900")

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (loading || session) {
    return null
  }

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          <Heading as="h1" size="xl" textAlign="center" bgGradient="linear(to-r, brand.400, brand.600)" bgClip="text">
            Join SkillXchange
          </Heading>

          <Box w="full" bg="white" rounded="lg" shadow="md" p={6}>
            <Tabs isFitted variant="enclosed">
              <TabList mb={4}>
                <Tab>Sign In</Tab>
                <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <LoginForm />
                </TabPanel>
                <TabPanel>
                  <SignUpForm />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
