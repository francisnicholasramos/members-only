"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedUser = isAuthenticatedUser;
async function isAuthenticatedUser(req, res, next) {
    try {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect("/login");
        }
    }
    catch (error) {
        return next(new Error("Catch error"));
    }
}
