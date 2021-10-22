import { config } from "dotenv";
config();
const SAWO_API=process.env.SAWO_API;

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/flauntZone", (req, res) => {
    res.render("flaunt_zone");
});

app.get("/diyAcademy", (req, res) => {
    res.render("diy_academy");
});

app.get("/blogs", (req, res) => {
    res.render("blogs");
});

app.get("/bazaar", (req, res) => {
    res.render("bazaar");
});

app.get("/login", (req, res) => {
    res.render("login", {SAWO_API : SAWO_API});
}); 

app.listen("3000", console.log("Listening on port 3000"));
