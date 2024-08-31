import User from "../models/userModel.js";
import Questions from "../models/questionsModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const createQuestion = async (req, res) => {
     try {
          const { questionseBy, name, link, questionTag } = req.body;
          if (!questionseBy || !name || !link || !questionTag) {
               return res.status(400).json({ error: "All fields are required" });
          }

          if (!["Arrays", "Linked List", "Greedy Algorithm", "Recursion", "Backtracking", "Binary Search", "Heaps", "Stack and Queue", "String", "Tree", "Graph", "Dynamic Programming", "Trie", "Segment Tree", "Miscellaneous"].includes(questionTag)) {
               return res.status(400).json({ error: "Invalid question tag" });
          }

          const user = await User.findById(questionseBy);
          if (!user) {
               return res.status(404).json({ error: "User not found" });
          }

          if (user._id.toString() !== req.user._id.toString()) {
               return res.status(401).json({ error: "Unauthorized to create question" });
          }

          const newQuestion = new Questions({ questionseBy, name, link, questionTag });
          await newQuestion.save();

          res.status(201).json(newQuestion);

     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}


const deleteQuestion = async (req, res) => {
     try {
          const question = await Questions.findById(req.params.id);
          if (!question) {
               return res.status(404).json({ error: "Question not found" });
          }

          if (question.questionseBy.toString() !== req.user._id.toString()) {
               return res.status(401).json({ error: "Unauthorized to delete question" });
          }

          await Questions.findByIdAndDelete(req.params.id);

          res.status(200).json({ message: "Question deleted successfully" });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};

const addNote = async (req, res) => {
     try {
          const { id } = req.params;
          const { notes } = req.body;

          if (!notes) {
               return res.status(400).json({ error: "Notes field is required" });
          }

          const question = await Questions.findById(id);

          if (!question) {
               return res.status(404).json({ error: "Question not found" });
          }

          if (question.questionseBy.toString() !== req.user._id.toString()) {
               return res.status(401).json({ error: "Unauthorized to add notes to this question" });
          }

          question.notes = notes;
          await question.save();

          res.status(200).json(question);
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
};

const getUserQuestions = async (req, res) => {
     const { username } = req.params;
     try {
          const user = await User.findOne({ username });
          if (!user) {
               return res.status(404).json({ error: "User not found" });
          }
          const questions = await Questions.find({ questionseBy: user._id }).sort({ createdAt: -1 });
          res.status(200).json(questions);
     } catch (error) {

     }
};

const getQuestionTopics = async (req, res) => {
     try {
          const { username } = req.params;
          const user = await User.findOne({ username });
          if (!user) {
               return res.status(404).json({ error: "User not found" });
          }
          const questions = await Questions.find({ questionseBy: user._id });
          console.log(questions);
          const topicCounts = questions.reduce((acc, question) => {
               acc[question.questionTag] = (acc[question.questionTag] || 0) + 1;
               return acc;
          }, {});
          console.log(topicCounts);
          const topicCountsArray = Object.keys(topicCounts).map(topic => ({
               topic,
               count: topicCounts[topic]
          }));
          console.log(topicCountsArray);
          res.json(topicCountsArray);
     } catch (err) {
          res.status(500).json({ error: 'Server error' });
     }
};

const getGenNot = async (req, res) => {
     try {
          const { name, link } = req.body;

          const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

          const model = genAI.getGenerativeModel({ model: "gemini-pro" });

          const prompt = `
          this is question name: "${name}"
          and this is question link: "${link}"
          can you give me notes for this of approximately 100 words in just 5 sentences and in one paragraph only`;

          const generatedNotes = await model.generateContent(prompt);

          const genAiNot = generatedNotes.response.text();

          res.status(200).send({ notes: genAiNot });
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

const getRec = async (req, res) => {
     try {
          const { username } = req.params;
          console.log(username);
          const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const user = await User.findOne({ username });
          if (!user) {
               return res.status(404).json({ error: "User not found" });
          }
          // Fetch all questions for the user
          const questions = await Questions.find({ questionseBy: user._id }).select('name link questionTag');

          if (questions.length === 0) {
               return res.status(404).json({ error: "No questions found for the user." });
          }

          // Create a prompt to send to the AI model
          const prompt = `
         Below are the questions with there names, links and topics:
         ${questions.map((q, index) => `${index + 1}. ${q.name}: ${q.link}, ${q.questionTag}`).join('\n')}
         I have practiced all this questions. Now suggested me exactly 3 questions different from this. Please only provide names of that questions. Each question should be separated by '||'.
         `;

          console.log(prompt);

          const recommendations = await model.generateContent(prompt);

          const genRec = recommendations.response.text();
          console.log(genRec);
          // Send the recommendations as a response
          res.status(200).json(genRec);
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
};

export { createQuestion, deleteQuestion, addNote, getUserQuestions, getGenNot, getQuestionTopics, getRec };