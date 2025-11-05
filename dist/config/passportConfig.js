"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_local_1 = require("passport-local");
const client_1 = require("../db/client");
passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
    try {
        const { data: user, error } = await client_1.supabase
            .from("users")
            .select()
            .eq("username", username)
            .maybeSingle();
        if (error) {
            return done(error);
        }
        if (!user) {
            return done(null, false, { message: "Username or password is incorrect." });
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Username or password is incorrect." });
        }
        return done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    console.log("serializeUser", user.id);
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    console.log("deserializeUser", id);
    try {
        const { data: user, error } = await client_1.supabase
            .from("users")
            .select()
            .eq("id", id)
            .single();
        if (error || !user) {
            return done(error || new Error("User not found"), null);
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
exports.default = passport_1.default;
