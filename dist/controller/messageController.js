"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedUser = isAuthenticatedUser;
exports.postNewMessage = postNewMessage;
exports.displayMessage = displayMessage;
const queries_1 = require("../db/queries");
const express_validator_1 = require("express-validator");
const client_1 = require("../db/client");
function isAuthenticatedUser(req, res) {
    if (req.isAuthenticated()) {
        res.render("/");
    }
    else {
        res.redirect("/login");
    }
}
async function postNewMessage(req, res, next) {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).send(errors.mapped());
            return;
        }
        if (!req.user)
            return; // i'm out of braincells to handle this. forgive me
        const inputs = {
            title: req.body.title,
            message: req.body.message,
            author: req.user.id
        };
        await (0, queries_1.postMessage)(inputs);
        res.redirect("/");
    }
    catch (error) {
        res.status(500).send(error);
    }
}
async function displayMessage(req, res) {
    try {
        const page = parseInt(req.query.page ?? "1", 10);
        const limit = 5;
        const offset = (page - 1) * limit;
        const allMessages = await (0, queries_1.displayAllMessage)(offset, limit);
        const allUsers = await (0, queries_1.getAllUsers)();
        const userMap = allUsers?.reduce((acc, user) => {
            acc[user.id] = user.username;
            return acc;
        }, {});
        const isAdmin = req.user?.privilege === 'admin';
        const tempAccess = req.decoded;
        const vipAccess = tempAccess && tempAccess.userId === req.user?.id;
        console.log('temporary access: ', tempAccess);
        const mapped = allMessages?.map(msg => ({
            id: msg.id,
            title: msg.title,
            message: msg.message,
            author_name: isAdmin || vipAccess
                ? userMap[msg.author_name] // if
                : msg.author_name === req.user?.id // else if ()
                    ? userMap[msg.author_name] // else if {}
                    : "Anonymous" // else
        }));
        const { count } = await client_1.supabase
            .from('messages')
            .select('*', { count: 'exact', head: true });
        if (count === null)
            throw new Error("Count error");
        const totalPages = Math.ceil(count / limit);
        res.render("index", {
            messages: mapped,
            page,
            totalPages,
            baseUrl: req.baseUrl || req.path
        });
    }
    catch (error) {
        console.log("Catch error", error);
    }
}
