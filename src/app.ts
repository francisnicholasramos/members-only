import express from "express";
import session from "express-session";
import path from "path";
import passport from "./config/passportConfig";
import cookieParser from "cookie-parser";

import { router as index } from "./routes/indexRoute";
import { router as signup } from "./routes/signUpRoutes";
import { router as login } from "./routes/loginRoute";
import { router as postMessage } from "./routes/postMessageRoute";
import { router as members } from "./routes/membersRoute";

const app = express();
const port = 3000;

app.set("views", path.join(__dirname, "../src/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "scripts")));
app.use("/styles", express.static(path.join(__dirname, "styles")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", index);
app.use("/", login);
app.use("/", signup);
app.use("/", postMessage);
app.use("/", members);

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie("connect.sid");
            res.redirect("/login")
        })
    })
})

app.use((req, res) => {
  if (req.isAuthenticated()) {
    res.status(404).send("404 page not found.");
  } else {
    res.redirect("/login");
  }
});

app.listen(port, () => {
  console.log(`Application is running on http://localhost:${port}`);
});
