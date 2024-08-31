import express from "express";
import { createQuestion, deleteQuestion, addNote, getUserQuestions, getGenNot, getQuestionTopics, getRec } from "../controllers/questionController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router=express.Router();

router.get("/user/:username",getUserQuestions);
router.post("/create",protectRoute,createQuestion);
router.post("/getGenNot",protectRoute,getGenNot);
router.post("/getRec/:username",protectRoute,getRec);
router.put("/note/:id",protectRoute,addNote);
router.delete("/:id",protectRoute,deleteQuestion);
router.get('/question-counts/:username',protectRoute,getQuestionTopics);

export default router;