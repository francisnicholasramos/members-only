"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const vipController_1 = require("../controller/vipController");
const indexController_1 = require("../controller/indexController");
exports.router = (0, express_1.Router)();
exports.router.get("/vip", indexController_1.isAuthenticatedUser, vipController_1.validateToken, (req, res) => res.render("vipForm"));
exports.router.post("/vip", vipController_1.tokenizeUser);
