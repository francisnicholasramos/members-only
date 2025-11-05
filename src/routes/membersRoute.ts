import {Router} from "express";
import {tokenizeUser, validateToken} from "../controller/vipController";
import {isAuthenticatedUser} from "../controller/indexController";

export const router = Router();

router.get("/vip", isAuthenticatedUser, validateToken, (req, res) => 
           res.render("vipForm"))

router.post("/vip", tokenizeUser);


