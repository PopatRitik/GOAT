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
	},
	{
		timestamps: true,
	}
);

const Questions = mongoose.model("questions", questionsSchema);

export default Questions;