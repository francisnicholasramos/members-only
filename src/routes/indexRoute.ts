import {Router} from "express";
import {isAuthenticatedUser} from "../controller/indexController";
import {validateToken} from "../controller/vipController";
import {displayMessage} from "../controller/messageController";

export const router = Router();

router.get("/", isAuthenticatedUser, validateToken, displayMessage)
