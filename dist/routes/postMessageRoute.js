"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const validator_1 = require("../validation/validator");
const messageController_1 = require("../controller/messageController");
exports.router = (0, express_1.Router)();
exports.router.get("/", messageController_1.isAuthenticatedUser);
exports.router.post("/post-message", validator_1.inputMessage, messageController_1.postNewMessage);
