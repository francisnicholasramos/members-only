"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const queries_1 = require("../db/queries");
async function signUp(req, res) {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(500).send(errors.mapped());
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(req.body.password, 10);
        const inputs = {
            username: req.body.username,
            password: hashedPassword
        };
        await (0, queries_1.postNewUser)(inputs);
        res.redirect("/");
    }
    catch (error) {
        res.status(500).send(error);
    }
}
