import {Request, Response} from "express";
import bcrypt from "bcrypt";
import {validationResult} from "express-validator";
import {postNewUser} from "../db/queries";
import {UserTypes} from "../types/SchemaTypes"

export async function signUp(req: Request, res: Response) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(500).send(errors.mapped())
      return;
    }
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const inputs: UserTypes = {
      username: req.body.username,
      password: hashedPassword
    }

    await postNewUser(inputs)
    res.redirect("/")
  } catch (error) {
      res.status(500).send(error)
  }
}
