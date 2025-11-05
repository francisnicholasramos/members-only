import {Router} from "express";
import {signUp} from "../controller/signupController"
import {signUpInput} from "../validation/validator"

export const router = Router();

router.route("/signup")
      .get((req, res) => {
          res.render("sign-up")
      })

router.route("/sign-up")
      .post(signUpInput, signUp)
