import {Router} from "express";
import {loginInput} from "../validation/validator";
import {handleLogin, isAuthenticatedUser, logDummyUser} from "../controller/loginController"

export const router = Router();

router.route("/login")
      .get(isAuthenticatedUser)
      .post(loginInput, handleLogin)

router.post("/try", logDummyUser)
