"use client"

import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Avatar,
  Text,
} from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import NextLink from "next/link"
import { useRouter } from "next/router"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"

interface NavbarProps {
  session: Session | null
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter()
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto" px={4}>
        <HStack spacing={8} alignItems="center">
          <NextLink href="/" passHref>
            <Link fontSize="xl" fontWeight="bold" color="brand.500">
              SkillXchange
            </Link>
          </NextLink>

          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <NextLink href="/browse" passHref>
              <Link>Browse</Link>
            </NextLink>
            {session && (
              <NextLink href="/dashboard" passHref>
                <Link>Dashboard</Link>
              </NextLink>
            )}
          </HStack>
        </HStack>

        <Flex alignItems="center">
          {session ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
                <HStack>
                  <Avatar size="sm" />
                  <Text display={{ base: "none", md: "block" }}>{session.user.email}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => router.push("/dashboard")}>Dashboard</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={4}>
              <NextLink href="/auth" passHref>
                <Button as="a" variant="ghost">
                  Sign In
                </Button>
              </NextLink>
              <NextLink href="/auth" passHref>
                <Button as="a" colorScheme="brand">
                  Sign Up
                </Button>
              </NextLink>
            </HStack>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
