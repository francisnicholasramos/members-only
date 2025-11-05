import {Request, Response, NextFunction} from "express";
import {MessageType} from "../types/SchemaTypes";
import {postMessage, displayAllMessage, getAllUsers} from "../db/queries"; import {validationResult} from "express-validator";
import {supabase} from "../db/client";

export function isAuthenticatedUser(req: Request, res: Response) {
    if (req.isAuthenticated()) {
        res.render("/") 
    } else {
        res.redirect("/login");
    }
}

export async function postNewMessage(req: Request, res: Response, next: NextFunction) { try { const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send(errors.mapped())
            return;
        }

        if (!req.user) return // i'm out of braincells to handle this. forgive me

        const inputs: MessageType = {
            title: req.body.title,
            message: req.body.message,
            author: req.user.id
        }

        await postMessage(inputs);
        res.redirect("/");

    } catch (error) {
        res.status(500).send(error)
    }
}

export async function displayMessage(req: Request, res: Response) {
    try {
        const page = parseInt((req.query.page as string) ?? "1", 10);
        const limit = 5;
        const offset = (page - 1) * limit;

        const allMessages = await displayAllMessage(offset, limit);

        const allUsers = await getAllUsers();

        const userMap = allUsers?.reduce((acc, user) => {
            acc[user.id] = user.username;
            return acc;
        }, {} as Record<number, string>);

        const isAdmin = req.user?.privilege === 'admin'

        const tempAccess = (req as any).decoded
        const vipAccess = tempAccess && tempAccess.userId === req.user?.id;

        console.log('temporary access: ',tempAccess)

        const mapped = allMessages?.map(msg => ({
            id: msg.id,
            title: msg.title,
            message: msg.message,
            author_name: 
              isAdmin || vipAccess
                ? userMap[msg.author_name]         // if
                : msg.author_name === req.user?.id // else if ()
                ? userMap[msg.author_name]         // else if {}
                : "Anonymous"                      // else
        }));

        const {count} = await supabase
                .from('messages')
                .select('*', {count: 'exact', head: true});

        if (count === null) throw new Error("Count error")

        const totalPages = Math.ceil(count / limit);

        res.render("index", {
            messages: mapped,
            page, 
            totalPages,
            baseUrl: req.baseUrl || req.path
        })

    } catch (error) {
        console.log("Catch error", error)
    }
}
