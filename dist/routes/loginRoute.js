"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const validator_1 = require("../validation/validator");
const loginController_1 = require("../controller/loginController");
exports.router = (0, express_1.Router)();
exports.router.route("/login")
    .get(loginController_1.isAuthenticatedUser)
    .post(validator_1.loginInput, loginController_1.handleLogin);
exports.router.post("/try", loginController_1.logDummyUser);
