import {Request, Response, NextFunction} from "express";
import {updateUserToken} from "../db/queries";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_TOKEN as string;

export async function tokenizeUser(req: Request, res: Response) {
  try {
    const userId = Number(req.user?.id);

    const token = jwt.sign({userId}, SECRET, {expiresIn: "90s"});

    const expiresAt: Date = new Date(Date.now() + 90 * 1000)

    if (req.user?.privilege === 'admin') {
        res.redirect("/")
        return; 
    }

    if (req.body.passcode === process.env.VIP_KEY) {

    await updateUserToken(userId, token, expiresAt) 

    res.cookie('vip_token', token, {
        httpOnly: true,
        maxAge: 90000
    });

    return res.redirect("/")

    }

    return res.redirect("/")
  } catch (error) {
    res.status(500).send(error)
  }
}


export async function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = 
      (req.query.token as string) ||
      (req.headers.authorization?.split(" ")[1] as string) || 
      req.cookies?.vip_token
    
    
    if (!token) {
      return next(); 
    }
    
    const decoded = jwt.verify(token, SECRET) as { userId: number, iat: number, exp: number };
    (req as any).decoded = decoded; 
    next(); 
    
  } catch (error) {
    console.log("Token validation error:", error);
    next();  
  }
}
