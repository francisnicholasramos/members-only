"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedUser = isAuthenticatedUser;
exports.logDummyUser = logDummyUser;
exports.handleLogin = handleLogin;
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const client_1 = require("../db/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
function isAuthenticatedUser(req, res, next) {
    if (req.isUnauthenticated()) {
        res.render("login");
    }
    else {
        res.redirect("/");
    }
}
async function logDummyUser(req, res, next) {
    try {
        const { data, error } = await client_1.supabase
            .from("users")
            .select()
            .eq("username", "test")
            .single();
        if (error) {
            console.log("Dummy user error");
            return res.redirect("/login");
        }
        const match = await bcrypt_1.default.compare(process.env.PASSWORD, data.password);
        if (!match) {
            return res.redirect("/login");
        }
        req.login(data, (err) => {
            if (err)
                return next(err);
            return res.redirect("/");
        });
    }
    catch (error) {
        console.log("Catch error dummy log: ", error);
    }
}
function handleLogin(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("login", {
            errors: errors.mapped(),
        });
    }
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err)
            return res.send(`Error occur: ${err}`);
        if (!user) {
            return res.render("login", { error: info?.message });
        }
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
}
