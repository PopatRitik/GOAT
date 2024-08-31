import React, { useEffect, useState } from 'react';
import {
    Box, Heading, VStack, Text, Link, Container, Flex, IconButton
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useParams } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from "react-router-dom";
import { FaUser } from 'react-icons/fa';
import { GiGoat } from "react-icons/gi";

const dsaSheets = [
    { name: 'Striver A2Z Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/' },
    { name: 'Striver SDE Sheet', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems' },
    { name: 'NeetCode DSA Sheet', url: 'https://neetcode.io/practice' }
];

const Dashboard = () => {
    const [topicData, setTopicData] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const userParam = useParams();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                const response = await fetch(`/api/questions/question-counts/${userParam.username}`);
                if (response.ok) {
                    const data = await response.json();
                    setTopicData(data);
                } else {
                    console.error('Failed to fetch topic data');
                }
            } catch (error) {
                console.error('Error fetching topic data:', error);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`/api/questions/getRec/${userParam.username}`, {
                    method: "POST"
                });
                if (response.ok) {
                    const data = await response.json();
                    const recommendationNames = data.split('||');
                    console.log(recommendationNames);
                    const formattedRecommendations = recommendationNames.map((name, index) => ({
                        id: index + 1,
                        name: name.trim()
                    }));
                    setRecommendations(formattedRecommendations);
                } else {
                    console.error('Failed to fetch recommendations');
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchTopicData();
        fetchRecommendations();
    }, [userParam]);

    return (
        <Box minHeight="100vh" style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }} py={5}>
            <Container maxW="container.xl">
                <VStack spacing={8} align="stretch">
                    <Flex direction={"row"} justifyContent="space-between" alignItems="center">
                        <Link as={RouterLink} to={`/${user.username}/questions`}>
                                <IconButton
                                    icon={<GiGoat />}
                                    bgGradient="linear(to-r, cyan.400, blue.500)"
                                    color="white"
                                    _hover={{ bgGradient: "linear(to-r, cyan.500, blue.600)" }}
                                    aria-label="User profile"
                                    size={"md"}
                                />
                        </Link>
                        <Link as={RouterLink} to={`/${user.username}`}>
                            <IconButton
                                icon={<FaUser />}
                                bgGradient="linear(to-r, cyan.400, blue.500)"
                                color="white"
                                _hover={{ bgGradient: "linear(to-r, cyan.500, blue.600)" }}
                                aria-label="User profile"
                                size={"md"}
                            />
                        </Link>
                    </Flex>
                    {/* Bar Chart for Topic Mastery */}
                    <Box bg="rgba(255,255,255,0.05)" rounded="lg" overflow="hidden" boxShadow="0 4px 6px rgba(0,0,0,0.1)">
                        <Heading size="lg" color="white" mb={4} textAlign="center">Topic Mastery</Heading>
                        {topicData.length > 0 ? (
                            <BarChart width={1200} height={400} data={topicData}>
                                <XAxis dataKey="topic" angle={-20} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#4FD1C5" />
                            </BarChart>
                        ) : (
                            <Text color="white" textAlign="center">No data available</Text>
                        )}
                    </Box>

                    {/* Personalized Recommendations */}
                    <Box bg="rgba(255,255,255,0.05)" rounded="lg" overflow="hidden" boxShadow="0 4px 6px rgba(0,0,0,0.1)" p={4}>
                        <Heading size="lg" color="white" mb={4}>Personalized Recommendations</Heading>
                        {recommendations.length > 0 ? (
                            recommendations.map((rec) => (
                                <Box key={rec.id} mb={4} p={4} bg="rgba(255,255,255,0.1)" rounded="md">
                                    <Text color="white" fontSize="lg" mb={2}>{rec.name}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text color="white" textAlign="center">No recommendations available</Text>
                        )}
                    </Box>

                    {/* Famous DSA Sheets Links */}
                    <Box bg="rgba(255,255,255,0.05)" rounded="lg" overflow="hidden" boxShadow="0 4px 6px rgba(0,0,0,0.1)" p={4}>
                        <Heading size="lg" color="white" mb={4}>Famous DSA Sheets</Heading>
                        {dsaSheets.map((sheet, index) => (
                            <Box key={index} mb={4}>
                                <Link href={sheet.url} isExternal color="blue.300" fontWeight="semibold">{sheet.name}</Link>
                            </Box>
                        ))}
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Dashboard;
