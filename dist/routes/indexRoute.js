"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const indexController_1 = require("../controller/indexController");
const vipController_1 = require("../controller/vipController");
const messageController_1 = require("../controller/messageController");
exports.router = (0, express_1.Router)();
exports.router.get("/", indexController_1.isAuthenticatedUser, vipController_1.validateToken, messageController_1.displayMessage);
