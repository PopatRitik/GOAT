import React from 'react';
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  Avatar,
  Heading,
  Container,
  Divider,
  useColorModeValue,
  Link,
  Spinner
} from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import useLogout from "../hooks/useLogout";
import useGetUserProfile from "../hooks/getUserProfile.js"; // Import the hook to fetch user profile
import ErrorPage from './Error_404.jsx'; // Import the error page component
import { Link as RouterLink } from "react-router-dom";

export default function UserPage() {
  const loggedInUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const logout = useLogout();
  const { loading, user: userProfile } = useGetUserProfile();

  if (loading) {
    return (
      <Flex justifyContent={"center"} marginTop={"100px"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // If the user profile from the URL is not found or doesn't match the logged-in user, show the error page
  if (!userProfile || loggedInUser.username !== userProfile.username) {
    return <ErrorPage />;
  }

  return (
    <Flex
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
    >
      <Container maxW="lg" py={12} px={6}>
        <Box
          bg={useColorModeValue('rgba(255,255,255,0.1)', 'rgba(0,0,30,0.7)')}
          rounded={'xl'}
          boxShadow={'0 0 20px rgba(0,100,255,0.3)'}
          p={8}
        >
          <VStack spacing={8} align="stretch">
            <Flex justifyContent="center">
              {loggedInUser.profilePic && (
                <Avatar
                  name={loggedInUser.name}
                  src={loggedInUser.profilePic}
                  size="2xl"
                  border="4px solid"
                  borderColor="cyan.400"
                />
              )}
              {!loggedInUser.profilePic && (
                <Avatar
                  name={loggedInUser.name}
                  src='https://bit.ly/broken-link'
                  size="2xl"
                  border="4px solid"
                  borderColor="cyan.400"
                />
              )}
            </Flex>

            <VStack spacing={3} align="center">
              <Heading
                fontSize="3xl"
                fontWeight="bold"
                color="cyan.100"
                textShadow="0 0 20px rgba(80,200,255,0.4)"
              >
                {loggedInUser.name}
              </Heading>
              <Text fontSize="lg" color="gray.300">@{loggedInUser.username}</Text>
              <Text fontSize="md" color="gray.400">{loggedInUser.email}</Text>
            </VStack>

            <Divider borderColor="gray.600" />

            <VStack spacing={4}>
              <Link as={RouterLink} w="full" to={`/${loggedInUser.username}/questions`}>
                <Button
                  leftIcon={<FaArrowLeft />}
                  w="full"
                  bgGradient="linear(to-r, cyan.700, blue.700)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, cyan.600, blue.600)",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,200,255,0.4)'
                  }}
                  transition="all 0.3s ease"
                >
                  Back to DSA Sheet
                </Button>
              </Link>
              <Link as={RouterLink} w="full" to={`/${loggedInUser.username}/update`}>
                <Button
                  leftIcon={<FaUserEdit />}
                  w="full"
                  bgGradient="linear(to-r, purple.700, pink.700)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(255,100,255,0.4)'
                  }}
                  transition="all 0.3s ease"
                >
                  Edit Profile
                </Button>
              </Link>

              <Button
                leftIcon={<FaSignOutAlt />}
                w="full"
                bg="red.600"
                color="white"
                _hover={{
                  bg: "red.500",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(255,100,100,0.4)'
                }}
                transition="all 0.3s ease" size={"xs"}
                onClick={logout}>
                Logout
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
