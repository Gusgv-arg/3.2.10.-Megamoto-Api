import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
import Messages from "../models/messages.js";
import { Transform } from "stream";

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const accessToken = process.env.SUPER_AGENT_API_KEY;

export const webhookMegamotoController2 = async (req, res) => {
	const data = req.body;
	//console.log("recibido de facebook", data);
	if (data.message) {
		const senderId = data.message.from;
		const receivedMessage = data.message.contents[0].text;
		const name = data.message.visitor.name;
		const channel = data.channel;
		console.log("mensaje recibido de facebook", receivedMessage);

		if (receivedMessage) {
			const agentId = "922bf166-b4b9-40a3-8385-5ad3aa94ec59";
			//const url = 'https://api.beta.superagent.sh/api/v1/agents/922bf166-b4b9-40a3-8385-5ad3aa94ec59/invoke';
			const url = `https://api.beta.superagent.sh/api/v1/agents/${agentId}/invoke`;
			const requestData = {
				input: receivedMessage,
				sessionId: "string",
				enableStreaming: true,
				outputSchema: "string",
			};

			const aiResponse = await axios.post(url, requestData, {
				headers: {
					accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				responseType: "stream",
			});
			console.log("aiResponse", aiResponse.data);

			//await handleMessage(senderId, aiResponse.data);
			let message = "";

			aiResponse.data
				.on("data", (chunk) => {
					// Elimina "data:" y el salto de línea del fragmento y luego concatena el fragmento al mensaje
					let part = chunk
						.toString()
						.replace("data:", "")
						.replace("\n", "")
						.trim();
					// Si el fragmento es un signo de puntuación, no añade espacio extra
					if (/[.,!?]/.test(part)) {
						message = message.trim() + part;
					} else {
						message += " " + part;
					}
				})
				.on("end", () => {
					// Llama a handleMessage con el mensaje completo cuando el stream se termina
					handleMessage(senderId, message.trim());
				});
		}
	}

	res.status(200).send("EVENT_RECEIVED");
};

async function handleMessage(senderId, message) {
	const response = await axios.post(
		"https://api.zenvia.com/v2/channels/facebook/messages",
		{
			from: process.env.ZENVIA_FACEBOOK_PAGE_ID,
			to: senderId,
			contents: [
				{
					type: "text",
					text: message,
				},
			],
		},
		{
			headers: {
				"X-API-TOKEN": process.env.ZENVIA_API_TOKEN,
			},
		}
	);
	//console.log("response despues de haber enviado el msje", response.data);
	if (response.data) {
		console.log("Message sent successfully");
	} else {
		console.log("Error sending message");
	}
}
