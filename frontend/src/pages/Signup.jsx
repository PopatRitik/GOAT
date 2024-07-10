import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import useShowToast from "../hooks/useShowToast";
import userAtom from '../atoms/userAtom'
import { Link as RouterLink } from "react-router-dom";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const handleSignup = async () => {
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.setItem("user-goat", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Flex
      align={'center'}
      justify={'center'}
      minHeight="100vh"
      style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading
            fontSize={'4xl'}
            textAlign={'center'}
            color="cyan.100"
            fontFamily="'Poppins', sans-serif"
            fontWeight="bold"
            letterSpacing="wide"
            textShadow="0 0 20px rgba(80,200,255,0.4)"
          >
            Sign up for DSA GOAT
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg="rgba(0,0,30,0.7)"
          boxShadow={'0 0 20px rgba(0,100,255,0.3)'}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel color="cyan.100">Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                    value={inputs.name}
                    bg="rgba(0,0,50,0.5)"
                    color="white"
                    borderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.200", boxShadow: "0 0 0 1px #63B3ED" }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel color="cyan.100">Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    value={inputs.username}
                    bg="rgba(0,0,50,0.5)"
                    color="white"
                    borderColor="blue.500"
                    _hover={{ borderColor: "blue.300" }}
                    _focus={{ borderColor: "blue.200", boxShadow: "0 0 0 1px #63B3ED" }}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel color="cyan.100">Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                value={inputs.email}
                bg="rgba(0,0,50,0.5)"
                color="white"
                borderColor="blue.500"
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.200", boxShadow: "0 0 0 1px #63B3ED" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="cyan.100">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  value={inputs.password}
                  bg="rgba(0,0,50,0.5)"
                  color="white"
                  borderColor="blue.500"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.200", boxShadow: "0 0 0 1px #63B3ED" }}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                    color="cyan.100"
                    _hover={{ bg: "rgba(0,100,255,0.2)" }}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bgGradient="linear(to-r, cyan.700, blue.700)"
                color={'white'}
                _hover={{
                  bgGradient: "linear(to-r, cyan.600, blue.600)",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,200,255,0.4)'
                }}
                onClick={handleSignup}
                transition="all 0.3s ease"
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'} color="cyan.100">
              Already a user? <Link as={RouterLink} color={'blue.400'} _hover={{ color: "blue.300" }} to='/login'>
                      Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}