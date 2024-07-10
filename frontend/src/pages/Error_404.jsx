import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  Container,
} from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Error_404() {
  const navigate = useNavigate();

  return (
    <Flex
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
    >
      <Container maxW="lg" textAlign="center">
        <VStack spacing={8}>
          <Box>
            <Heading
              display="inline-block"
              as="h1"
              fontSize="9xl"
              bgGradient="linear(to-r, cyan.400, blue.500, purple.600)"
              backgroundClip="text"
              fontWeight="extrabold"
            >
              404
            </Heading>
          </Box>
          <Heading
            as="h2"
            size="xl"
            color="cyan.100"
            textShadow="0 0 20px rgba(80,200,255,0.4)"
          >
            Page Not Found
          </Heading>
          <Text fontSize="lg" color="gray.300">
            Oops! The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            leftIcon={<FaHome />}
            onClick={() => navigate('/')}
            bgGradient="linear(to-r, cyan.400, blue.500)"
            color="white"
            _hover={{
              bgGradient: "linear(to-r, cyan.500, blue.600)",
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0,200,255,0.4)'
            }}
            transition="all 0.3s ease"
            size="lg"
            fontWeight="bold"
          >
            Go to Home
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
}