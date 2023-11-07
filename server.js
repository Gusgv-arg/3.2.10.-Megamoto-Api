import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import chatMegamotoRouter from "./routers/chatMegamotoRouter.js";

dotenv.config();

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to data base MegamotoDB");
	})
	.catch((err) => {
		console.log(err.message);
	});

const app = express();

app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
	})
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/megamoto", chatMegamotoRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
