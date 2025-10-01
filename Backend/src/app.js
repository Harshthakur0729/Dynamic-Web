import express from "express";
import session from "express-session";
import cors from "cors"
import config from './config/config.js';
import adminRoute from "../src/Router/admin.route.js"
import dynamicRoute from "../src/Router/dynamic.js"
import otherRoute from "../src/Router/other.route.js"
import webStyleRoute from "./Router/WebStyle.route.js"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app = express();
app.use(cors({ origin: config.ORIGIN, credentials: true }))
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(cookieParser());
app.use("/api/admin", adminRoute, dynamicRoute, otherRoute, webStyleRoute);

export default app