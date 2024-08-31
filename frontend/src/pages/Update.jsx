import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Avatar,
  Center,
  Box,
  Link,
  Spinner
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { Link as RouterLink } from "react-router-dom";
import useGetUserProfile from "../hooks/getUserProfile.js"; // Import the hook to fetch user profile
import ErrorPage from './Error_404.jsx'; // Import the error page component
//small change done
export default function UpdatePage() {
  const loggedInUser = useRecoilValue(userAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    password: "",
  });
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const { handleImageChange, imgUrl } = usePreviewImg();
  const { loading, user: userProfile } = useGetUserProfile(); // Use the hook to get the user profile from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json(); // updated user object
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-goat", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  // Show a loading state while fetching user profile
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
    <form onSubmit={handleSubmit}>
      <Flex
        align={"center"}
        justify={"center"}
        minHeight="100vh"
        style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }}
      >
        <Box
          w={"full"}
          maxW={"md"}
          bg="rgba(0,0,30,0.7)"
          rounded={"xl"}
          boxShadow={"0 0 20px rgba(0,100,255,0.3)"}
          p={6}
          my={6}
        >
          <Stack spacing={4}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl" }}
              color="cyan.100"
              textAlign="center"
              fontFamily="'Poppins', sans-serif"
              fontWeight="bold"
              letterSpacing="wide"
              textShadow="0 0 20px rgba(80,200,255,0.4)"
            >
              User Profile Edit
            </Heading>
            <FormControl id='userName'>
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
                </Center>
                <Center w='full'>
                  <Button
                    w='full'
                    onClick={() => fileRef.current.click()}
                    bgGradient="linear(to-r, cyan.700, blue.700)"
                    color={'white'}
                    _hover={{
                      bgGradient: "linear(to-r, cyan.600, blue.600)",
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,200,255,0.4)'
                    }}
                    transition="all 0.3s ease"
                  >
                    Change Avatar
                  </Button>
                  <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                </Center>
              </Stack>
            </FormControl>
            {["name", "username", "email", "password"].map((field) => (
              <FormControl key={field}>
                <FormLabel color="cyan.100">{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                <Input
                  placeholder={field === "email" ? "your-email@example.com" : `Your ${field}`}
                  value={inputs[field]}
                  onChange={(e) => setInputs({ ...inputs, [field]: e.target.value })}
                  type={field === "password" ? "password" : "text"}
                  bg="rgba(0,0,50,0.5)"
                  color="white"
                  borderColor="blue.500"
                  _hover={{ borderColor: "blue.300" }}
                  _focus={{ borderColor: "blue.200", boxShadow: "0 0 0 1px #63B3ED" }}
                  _placeholder={{ color: "gray.400" }}
                />
              </FormControl>
            ))}
            <Stack spacing={6} direction={["column", "row"]}>
              <Link as={RouterLink} color={'blue.400'} _hover={{ color: "blue.300" }} to={`/${user.username}`}>
                <Button
                  w='full'
                  bgGradient="linear(to-r, red.800, #800000)"
                  color="white"
                  _hover={{ bgGradient: "linear(to-r, red.500, red.800)" }}
                  transition="all 0.3s ease"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                w='full'
                bgGradient="linear(to-r, green.400, teal.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, green.500, teal.600)" }}
                type='submit'
                isLoading={updating}
                transition="all 0.3s ease"
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Flex>
    </form>
  );
}
