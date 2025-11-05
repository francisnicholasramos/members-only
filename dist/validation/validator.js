"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputMessage = exports.loginInput = exports.signUpInput = void 0;
const express_validator_1 = require("express-validator");
const client_1 = require("../db/client");
exports.signUpInput = (0, express_validator_1.checkSchema)({ username: {
        in: ["body"],
        isString: { errorMessage: "Username must be a text" },
        isLength: {
            options: { min: 3, max: 30 },
            errorMessage: "Username should be 3 to 30 long"
        },
        notEmpty: { errorMessage: "Username is required." },
        custom: {
            options: async (value) => {
                if (!isNaN(Number(value))) {
                    throw new Error("Username must be a text");
                }
                const { data, error } = await client_1.supabase
                    .from("users")
                    .select("username")
                    .ilike("username", value)
                    .single();
                if (data)
                    throw new Error("User already exists.");
                return true; // if both checks pass, return true
            }
        }
    },
    password: {
        in: ["body"],
        isLength: {
            options: { min: 8, max: 255 },
            errorMessage: "Password should be 8 to 255 long"
        },
        notEmpty: { errorMessage: "Password is required." },
    }
});
exports.loginInput = (0, express_validator_1.checkSchema)({
    username: {
        in: ["body"],
        notEmpty: { errorMessage: "Username is required." },
    },
    password: {
        notEmpty: { errorMessage: "Password is required." },
    }
});
exports.inputMessage = (0, express_validator_1.checkSchema)({
    title: {
        in: ["body"],
        notEmpty: { errorMessage: "Title is required." },
        isLength: {
            options: { min: 3, max: 30 },
            errorMessage: "Title should be 3 to 30 long"
        },
    },
    message: {
        in: ["body"],
        notEmpty: { errorMessage: "Message is required." },
        custom: {
            options: (value) => {
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 100;
            },
            errorMessage: "Message must be not exceed 100 words. Hindi ka tatagos."
        },
    },
});
