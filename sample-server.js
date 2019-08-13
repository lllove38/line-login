"use strict";

require("dotenv").config();

const app = require('express')();
const session = require("express-session");
const session_options = {
    secret: "2ed8ced7584d201e77d8930ec3c9cb6d",
    resave: false,
    saveUninitialized: false
}
app.use(session(session_options));

let line_login;
if (process.env.NODE_ENV == "development"){
    line_login = require("./module/line-login");
} else {
    line_login = require("./module/line-login");
}

const login = new line_login({
    channel_id: "1607908151",
    channel_secret: "2ed8ced7584d201e77d8930ec3c9cb6d",
    //channel_id: process.env.LINE_LOGIN_CHANNEL_ID,
    //channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    //callback_url: process.env.LINE_LOGIN_CALLBACK_URL,
   callback_url: "http://line-login.nathakit999.now.sh/callback",
    //callback_url:"https://mystifying-heisenberg-10dfb3.netlify.com/",
   scope: "openid profile email",
    prompt: "consent",
    bot_prompt: "normal"
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening to ${process.env.PORT || 5000}...`);
});

// Specify the path you want to start authorization.
app.get("/", login.auth());

// Specify the path you want to wait for the callback from LINE authorization endpoint.
app.get("/callback", login.callback(
    (req, res, next, token_response) => {
        // Success callback
        res.json(token_response);
    },
    (req, res, next, error) => {
        // Failure callback
        res.status(400).json(error);
    }
));
