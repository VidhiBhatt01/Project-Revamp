import { config } from "dotenv";
config();
const SAWO_API = process.env.SAWO_API;
import { CourierClient } from "@trycourier/courier";
const courier = CourierClient({ authorizationToken: process.env.courierAPI });

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
var payload = null;
var username = null;
var logged = false;

mongoose.connect("mongodb+srv://admin-kavan:" + process.env.MONGOKEY + "@cluster0.ke92r.mongodb.net/revampers").then(() => console.log("Connected")).catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: String,
    fName: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    const payloadCookies = req.cookies["payload"];
    if (payloadCookies != "undefined" && payloadCookies != undefined) {
        payload = JSON.parse(payloadCookies);
        // console.log("In backend");
        // console.log(payload);
        if (payload != undefined) {
            const { identifier, customFieldInputValues } = payload;
            const fName = customFieldInputValues["Full Name"];
            username = identifier;

            User.findOne({ username: identifier }, ((err, foundUser) => {
                if (err) console.log(err);
                else if (foundUser == undefined || foundUser == null) {
                    const newUser = new User({
                        username: identifier,
                        fName: fName
                    });

                    // for sending a new Courier Email Message
                    const { messageId } = courier.send({
                        brand: "3PXQ2M35SK432XQ1NBS6CGTNQ2MQ",
                        eventId: "personalized-welcome-email",
                        recipientId: "19f2dd54-777d-491c-b584-de75015c41eb",
                        profile: {
                            email: identifier,
                        },
                        data: {
                            firstname: fName,
                        },
                        override: {
                        },
                    });
                    newUser.save();
                }
            }));
            logged = true;
            res.render("index", { logged: true, username: username });
        } else {
            res.render("index", { logged: false, username: username });
        }
    } else {
        res.render("index", { logged: false, username: username });
    }
});

app.get("/flauntZone", (req, res) => {
    res.render("flaunt_zone", { logged: logged, username: username });
});

app.get("/diyAcademy", (req, res) => {
    res.render("diy_academy", { logged: logged, username: username });
});

app.get("/blogs", (req, res) => {
    res.render("blogs", { logged: logged, username: username });
});

app.get("/bazaar", (req, res) => {
    res.render("bazaar", { logged: logged, username: username });
});

app.get("/login", (req, res) => {
    res.render("login", { logged: logged, username: username });
});

app.get("/logout", (req, res) => {
    res.cookie("payload", undefined);
    res.redirect("/");
});

app.listen("3000", console.log("Listening on port 3000"));