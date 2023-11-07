import express from "express";
import {webhookMegamotoController} from "../controllers/webhookMegamotoController.js"

const chatMegamotoRouter = express.Router();

chatMegamotoRouter.post("/webhook-megamoto", webhookMegamotoController);

export default chatMegamotoRouter;
