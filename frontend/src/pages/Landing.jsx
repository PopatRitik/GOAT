import React from 'react';
import { Box, Heading, Button, VStack, HStack, Container, Link } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";

const Landing = () => {
  return (
    <Box
      height="100vh"
      style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxW="container.xl" textAlign="center">
        <VStack spacing={12}>
          <Heading
            as="h1"
            size="4xl"
            color="cyan.100"
            fontFamily="'Poppins', sans-serif"
            fontWeight="bold"
            letterSpacing="wide"
            textShadow="0 0 20px rgba(80,200,255,0.4)"
          >
            Welcome to your own DSA sheet 'GOAT'
          </Heading>
          
          <HStack spacing={6}>
          <Link as={RouterLink} to='/login'>
            <Button
              size="lg"
              bgGradient="linear(to-r, cyan.700, blue.700)"
              color="white"
              _hover={{ 
                bgGradient: "linear(to-r, cyan.600, blue.600)",
                transform: 'translateY(-2px)', 
                boxShadow: '0 4px 20px rgba(0,200,255,0.4)'
              }}
              transition="all 0.3s ease"
            >
              Login
            </Button>
            </Link>
            <Link as={RouterLink} to='/signup'>
            <Button
              size="lg"
              bgGradient="linear(to-r, blue.700, purple.700)"
              color="white"
              _hover={{ 
                bgGradient: "linear(to-r, blue.600, purple.600)",
                transform: 'translateY(-2px)', 
                boxShadow: '0 4px 20px rgba(100,100,255,0.4)'
              }}
              transition="all 0.3s ease"
            >
              Sign Up
            </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Landing;