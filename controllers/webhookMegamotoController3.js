import axios from "axios";
import dotenv from "dotenv";
import { spawn } from "child_process";
import path from "path";

dotenv.config();


export const webhookMegamotoController3 = async (req, res) => {
	const dataReceived = req.body;
	//console.log("recibido de facebook", dataReceived);
	if (dataReceived.message) {
		const senderId = dataReceived.message.from;
		const receivedMessage = dataReceived.message.contents[0].text;
		const name = dataReceived.message.visitor.name;
		const channel = dataReceived.channel;
		console.log("mensaje recibido de facebook", receivedMessage);

		if (receivedMessage) {
			// Llamar al script de Python para realizar la petición a SuperAgent
			const pythonProcess = spawn("python", [
				"python/superagentInvoke.py",
				receivedMessage,
			]);
			

			pythonProcess.stdout.on("data", (data) => {
				const aiResponse = data.toString().trim();
				// Manejar la respuesta de SuperAgent aquí
				console.log("aiResponse", aiResponse)
				handleMessage(senderId, aiResponse);
			});

			pythonProcess.stderr.on("data", (data) => {
				console.error(`Error en el script de Python: ${data}`);
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
