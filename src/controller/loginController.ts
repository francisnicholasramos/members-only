import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import passport from "passport";
import {supabase} from "../db/client";
import bcrypt from "bcrypt";

export function isAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
    if (req.isUnauthenticated()) {
        res.render("login")
    } else {
        res.redirect("/");
    }

}

export async function logDummyUser(req:Request, res:Response, next: NextFunction) {
    try {
        const {data, error} = await supabase
            .from("users")
            .select()
            .eq("username", "test")
            .single()

            if (error) {
                console.log("Dummy user error")
                return res.redirect("/login");
            }

            const match = await bcrypt.compare(process.env.PASSWORD as string, data.password)

            if (!match) {
                return res.redirect("/login");
            }

            req.login(data, (err) => {
                if (err) return next(err)
                return res.redirect("/")
            })

    } catch (error) {
        console.log("Catch error dummy log: ",error)
    }
}

export function handleLogin(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("login", {
            errors: errors.mapped(),
        });
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) return res.send(`Error occur: ${err}`)


        if (!user) {
            return res.render("login", { error: info?.message });
        }


        req.logIn(user, (err) => {
            if (err) return next(err)

            return res.redirect("/");
        })
    })(req, res, next)
}

