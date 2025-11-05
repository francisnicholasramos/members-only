"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeUser = tokenizeUser;
exports.validateToken = validateToken;
const queries_1 = require("../db/queries");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_TOKEN;
async function tokenizeUser(req, res) {
    try {
        const userId = Number(req.user?.id);
        const token = jsonwebtoken_1.default.sign({ userId }, SECRET, { expiresIn: "90s" });
        const expiresAt = new Date(Date.now() + 90 * 1000);
        if (req.user?.privilege === 'admin') {
            res.redirect("/");
            return;
        }
        if (req.body.passcode === process.env.VIP_KEY) {
            await (0, queries_1.updateUserToken)(userId, token, expiresAt);
            res.cookie('vip_token', token, {
                httpOnly: true,
                maxAge: 90000
            });
            return res.redirect("/");
        }
        return res.redirect("/");
    }
    catch (error) {
        res.status(500).send(error);
    }
}
async function validateToken(req, res, next) {
    try {
        const token = req.query.token ||
            req.headers.authorization?.split(" ")[1] ||
            req.cookies?.vip_token;
        if (!token) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        req.decoded = decoded;
        next();
    }
    catch (error) {
        console.log("Token validation error:", error);
        next();
    }
}
