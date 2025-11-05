"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const signupController_1 = require("../controller/signupController");
const validator_1 = require("../validation/validator");
exports.router = (0, express_1.Router)();
exports.router.route("/signup")
    .get((req, res) => {
    res.render("sign-up");
});
exports.router.route("/sign-up")
    .post(validator_1.signUpInput, signupController_1.signUp);
