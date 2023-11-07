import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		id_user: { type: String, required: true },
		role: { type: String, required: true },
		content: { type: String, required: true },
		channel: { type: String, required: true },		
	},
	{
		timestamps: true,
	}
);

const Messages = mongoose.model("Messages", messageSchema);
export default Messages;
