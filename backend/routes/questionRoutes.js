import express from "express";
import { createQuestion, deleteQuestion, addNote, getUserQuestions, getGenNot } from "../controllers/questionController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router=express.Router();

router.get("/user/:username",getUserQuestions);
router.post("/create",protectRoute,createQuestion);
router.post("/getGenNot",protectRoute,getGenNot);
router.put("/note/:id",protectRoute,addNote);
router.delete("/:id",protectRoute,deleteQuestion);

export default router;