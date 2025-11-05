"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const passportConfig_1 = __importDefault(require("./config/passportConfig"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const indexRoute_1 = require("./routes/indexRoute");
const signUpRoutes_1 = require("./routes/signUpRoutes");
const loginRoute_1 = require("./routes/loginRoute");
const postMessageRoute_1 = require("./routes/postMessageRoute");
const membersRoute_1 = require("./routes/membersRoute");
const app = (0, express_1.default)();
const port = 3000;
app.set("views", path_1.default.join(__dirname, "../src/views"));
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "scripts")));
app.use("/styles", express_1.default.static(path_1.default.join(__dirname, "styles")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //     secure: process.env.NODE_ENV === "production",
    //     httpOnly: true,
    //     sameSite: "lax",
    //     maxAge: 24 * 60 * 60 * 1000
    // }
}));
app.use(passportConfig_1.default.initialize());
app.use(passportConfig_1.default.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use("/", indexRoute_1.router);
app.use("/", loginRoute_1.router);
app.use("/", signUpRoutes_1.router);
app.use("/", postMessageRoute_1.router);
app.use("/", membersRoute_1.router);
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err)
                return next(err);
            res.clearCookie("connect.sid");
            res.redirect("/login");
        });
    });
});
app.use((req, res) => {
    if (req.isAuthenticated()) {
        res.status(404).send("404 page not found.");
    }
    else {
        res.redirect("/login");
    }
});
app.listen(port, () => {
    console.log(`Application is running on http://localhost:${port}`);
});
