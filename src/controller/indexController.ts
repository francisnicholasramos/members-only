import {Request, Response, NextFunction} from "express";

export async function isAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
    try { 
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect("/login")
        }

    } catch (error) {
        return next(new Error("Catch error"))
    }
}
