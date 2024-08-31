import mongoose from "mongoose";

const questionsSchema = mongoose.Schema(
	{
		questionseBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
		},
		link: {
			type: String,
		},
		notes: {
			type: String,
		},
		questionTag: {
			type: String,
			enum: [
				"Arrays",
				"Linked List",
				"Greedy Algorithm",
				"Recursion",
				"Backtracking",
				"Binary Search",
				"Heaps",
				"Stack and Queue",
				"String",
				"Tree",
				"Graph",
				"Dynamic Programming",
				"Trie",
				"Segment Tree",
				"Miscellaneous",
			],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);


const Questions = mongoose.model("questions", questionsSchema);

export default Questions;