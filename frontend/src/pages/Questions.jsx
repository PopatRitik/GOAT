import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Input, IconButton, Button, VStack, HStack, Text, Link,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, Table, Thead, Tbody, Tr, Th, Td, Textarea, Container, useToast,
  Spacer
} from '@chakra-ui/react';
import { FaUser, FaPlus, FaRandom, FaTrash, FaEdit, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { SiGooglegemini } from "react-icons/si";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isNotesOpen, onOpen: onNotesOpen, onClose: onNotesClose } = useDisclosure();
  const [newQuestion, setNewQuestion] = useState({ name: '', link: '' });
  const [currentNotes, setCurrentNotes] = useState({ id: '', notes: '' });
  const navigate = useNavigate();
  const toast = useToast();
  const user = useRecoilValue(userAtom);
  const userParam = useParams();
  const [currentQuestion, setCurrentQuestion] = useState({ name: '', link: '' });

  useEffect(() => {
    fetchQuestions();
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/questions/user/${userParam.username}`);
      const data = await res.json();
      if (res.ok) {
        setQuestions(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddQuestion = async () => {
    try {
      const res = await fetch("/api/questions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newQuestion, questionseBy: user._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions([data, ...questions]);
        setNewQuestion({ name: '', link: '' });
        onAddClose();
        toast({
          title: "Success",
          description: "Question added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(questions.filter(q => q._id !== id));
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateNotes = async () => {
    try {
      const res = await fetch(`/api/questions/note/${currentNotes.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: currentNotes.notes }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(questions.map(q => q._id === currentNotes.id ? { ...q, notes: currentNotes.notes } : q));
        onNotesClose();
        toast({
          title: "Success",
          description: "Notes updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePickRandom = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log(randomQuestion);
    if (randomQuestion) {
      window.open(randomQuestion.link, '_blank');
    } else {
      toast({
        title: "Info",
        description: "No questions available to pick from",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGenerateNotes = async () => {
    try {
      if (!currentQuestion) {
        toast({
          title: "Error",
          description: "No question selected",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const res = await fetch(`/api/questions/getGenNot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: currentQuestion.name, link: currentQuestion.link }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setCurrentNotes({ ...currentNotes, notes: data.notes });
        toast({
          title: "Success",
          description: "Notes generated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate notes",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const truncateName = (name) => {
    return name.length > 20 ? name.slice(0, 20) + '...' : name;
  };

  return (
    <Box minHeight="100vh" style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }} py={5}>
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <HStack spacing={4}>
            {user.username === userParam.username && (
              <Button
                leftIcon={<FaPlus />}
                onClick={onAddOpen}
                bgGradient="linear(to-r, green.400, teal.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, green.500, teal.600)" }}
              >
                Add
              </Button>
            )}
            <Button
              leftIcon={<FaRandom />}
              onClick={handlePickRandom}
              bgGradient="linear(to-r, purple.400, pink.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, purple.500, pink.600)" }}
            >
              Pick Random
            </Button>
          </HStack>
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width="40%"
            bg="rgba(255,255,255,0.1)"
            color="white"
            _placeholder={{ color: "gray.300" }}
            borderColor="transparent"
            _hover={{ borderColor: "blue.300" }}
            _focus={{ borderColor: "blue.300", boxShadow: "0 0 0 1px #63B3ED" }}
          />
          {user.username === userParam.username && (
            <Link as={RouterLink} to={`/${user.username}`}>
              <IconButton
                icon={<FaUser />}
                bgGradient="linear(to-r, cyan.400, blue.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, cyan.500, blue.600)" }}
                aria-label="User profile"
              />
            </Link>
          )}
        </Flex>

        <Box
          bg="rgba(255,255,255,0.05)"
          rounded="lg"
          overflow="hidden"
          boxShadow="0 4px 6px rgba(0,0,0,0.1)"
        >
          <Table variant="simple">
            <Thead bg="rgba(0,0,0,0.2)">
              <Tr>
                <Th color="cyan.100">Name</Th>
                <Th color="cyan.100">Link</Th>
                {user.username === userParam.username && <Th color="cyan.100">Notes</Th>}
                {user.username === userParam.username && <Th color="cyan.100">Actions</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {questions.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase())).map((question) => (
                <Tr key={question._id} _hover={{ bg: "rgba(255,255,255,0.05)" }}>
                  <Td color="white">{truncateName(question.name)}</Td>
                  <Td>
                    <Link href={question.link} isExternal color="blue.300" fontWeight="semibold">
                      <HStack>
                        <Text>View Question</Text>
                        <FaExternalLinkAlt size="12px" />
                      </HStack>
                    </Link>
                  </Td>
                  {user.username === userParam.username && (
                    <Td>
                      <IconButton
                        icon={<FaEdit />}
                        size="sm"
                        onClick={() => {
                          setCurrentQuestion({name: question.name, link: question.link});
                          setCurrentNotes({ id: question._id, notes: question.notes });
                          onNotesOpen();
                        }}
                        colorScheme="yellow"
                        variant="ghost"
                        aria-label="Edit notes"
                      />
                    </Td>
                  )}
                  {user.username === userParam.username && (
                    <Td>
                      <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        onClick={() => handleDeleteQuestion(question._id)}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Delete question"
                      />
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Add Question Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Question</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder="Question Name"
                  value={newQuestion.name}
                  onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                />
                <Input
                  placeholder="Question Link"
                  value={newQuestion.link}
                  onChange={(e) => setNewQuestion({ ...newQuestion, link: e.target.value })}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleAddQuestion} bgGradient="linear(to-r, green.400, teal.500)" color="white">
                Add Question
              </Button>
              <Button ml={3} onClick={onAddClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Notes Modal */}
        <Modal isOpen={isNotesOpen} onClose={onNotesClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Notes</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                value={currentNotes.notes}
                onChange={(e) => setCurrentNotes({ ...currentNotes, notes: e.target.value })}
                placeholder="Enter notes..."
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleGenerateNotes} bgGradient="linear(to-r, green.400, teal.500)" color="white">
                <SiGooglegemini />
              </Button>
              <Spacer></Spacer>
              <Button onClick={handleUpdateNotes} bgGradient="linear(to-r, green.400, teal.500)" color="white">
                Save Notes
              </Button>
              <Button ml={3} onClick={onNotesClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
