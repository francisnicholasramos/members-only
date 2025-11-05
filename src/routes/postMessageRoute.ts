import {Router} from "express";
import {inputMessage} from "../validation/validator";
import {postNewMessage, isAuthenticatedUser} from "../controller/messageController";

export const router = Router();

router.get("/", isAuthenticatedUser)
router.post("/post-message", inputMessage, postNewMessage)

