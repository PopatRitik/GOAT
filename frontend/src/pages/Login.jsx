import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
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
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "test2",
    password: "123",
  });
  const showToast = useShowToast();
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/login", {
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
      console.log("hi1");
      localStorage.setItem("user-goat", JSON.stringify(data));
      console.log("hi1");
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
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
            Login to DSA GOAT
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg="rgba(0,0,30,0.7)"
          boxShadow={'0 0 20px rgba(0,100,255,0.3)'}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="cyan.100">Username</FormLabel>
              <Input
                type="text"
                value={inputs.username}
                onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
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
                  value={inputs.password}
                  onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
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
                size="lg"
                bgGradient="linear(to-r, cyan.700, blue.700)"
                color={'white'}
                _hover={{
                  bgGradient: "linear(to-r, cyan.600, blue.600)",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,200,255,0.4)'
                }}
                onClick={handleLogin}
                isLoading={loading}
                loadingText="Logging In"
                transition="all 0.3s ease"
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'} color="cyan.100">
                Don't have an account? <Link as={RouterLink} color={'blue.400'} _hover={{ color: "blue.300" }} to='/signup'>
                      Sign Up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}